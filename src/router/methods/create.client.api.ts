
import path from 'node:path';
import fs from 'node:fs';
import { Writable } from 'node:stream';
import Joi from 'joi';
import { TPromiseExecutor } from '../../types/types';
import {
  IRouterConfig, IRoutes, TJoiSchema,
  THandler, THandlerSchema,
} from '../types';
import { SIMPLE_TYPES } from '../constants';
import * as tpl from './templates';
import { isHandler, isJoiSchema } from '../utils';

export const createClientApi = (config: IRouterConfig, routes: IRoutes) => {
  const executor: TPromiseExecutor<void> = (rv, rj) => {
    const apiPath = config.clientApiPath;
    const apiExt = path.extname(apiPath);
    const apiDir = path.dirname(apiPath);
    const apiFileNameBase = path.basename(apiPath, apiExt);
    const typesFileNameBase = apiFileNameBase + '.types';
    const typesFileName = typesFileNameBase + '.ts';
    const typesPath = path.join(apiDir, typesFileName);
    const apiStream = fs.createWriteStream(apiPath);
    const typesStream = fs.createWriteStream(typesPath);
    let isFinish = false;
    const handleFinish = () => (isFinish ? rv() : isFinish = true);
    const handleError = (e: Error) => {
      apiStream.close();
      typesStream.close();
      rj(e);
    };
    apiStream.on('error', handleError);
    apiStream.on('finish', handleFinish);
    typesStream.on('error', handleError);
    typesStream.on('finish', handleFinish);
    const apiTypesPath = path.resolve(config.apiPath, 'types.js');
    const apiTypes = require(apiTypesPath) as Record<string, TJoiSchema>;
    apiStream.write(tpl.strGetApi(typesFileNameBase));
    createJs(apiTypes, apiStream, typesStream)(routes);
    apiStream.write(');\n');
    apiStream.close();
    typesStream.close();
  };

  return new Promise(executor);
};

export const createJs = (
  apiTypes: Record<string, TJoiSchema>,
  apiStream: Writable,
  typesStream: Writable
) => function createJs(routes: IRoutes, pathname = '', indent = '') {
  apiStream.write('{');
  const nextIndent = indent + '  ';
  const routesKeys = Object.keys(routes);

  for (const key of routesKeys) {
    apiStream.write(tpl.strKey(nextIndent, key));
    const handler = routes[key] as THandler | IRoutes;
    const nextPathname = pathname + '/' + key;
    if (!isHandler(handler)) {
      createJs(handler, nextPathname, nextIndent);
      apiStream.write(',');
      continue;
    }
    const typeName = getTypeNameFromPathname(nextPathname);
    const paramsTypeName = getTypeName(
      'params', apiTypes, typesStream, typeName, handler,
    );
    const responseTypeName = getTypeName(
      'response', apiTypes, typesStream, typeName, handler,
    );
    apiStream.write(
      tpl.strMethod(paramsTypeName, responseTypeName, nextPathname, nextIndent),
    );
  }

  apiStream.write('\n' + indent + '}');
};

const getTypeNameFromPathname = (pathname: string) => 'T' + pathname
  .replace('/', '')
  .replace(/\./g, '')
  .split('/')
  .map((part) => part[0]?.toUpperCase() + part.slice(1))
  .join('');

const getTypes = (
  schema?: THandlerSchema,
  indent = ''
): string => {
  if (!schema) return '';

  if (isJoiSchema(schema)) {
    let type = schema.type || '';
    if (type === 'object') type = 'Record<string, any>';
    else if (type === 'any') type = getSchemaType(schema);
    return type;
  }

  if (Array.isArray(schema)) {
    return schema
      .map((item) => getTypes(item, indent))
      .join(' | ');
  }

  const schemaEntries = Object.entries(schema);
  const types = schemaEntries
    .map(([key, item]) => tpl.strTypes(indent, key, getTypes(item, indent)));
  return '{' + types.join('') + '\n' + indent + '}';
};

const getSchemaType = (schema: Joi.Schema) => {
  const schemaValuesSet = (schema as any)._valids._values;
  const [type] = [...schemaValuesSet.values()];
  return `${type}`;
};

const findPredefinedSchema = (
  apiTypes: Record<string, TJoiSchema>,
  schema: THandlerSchema,
) => Object.keys(apiTypes)
  .find((key) => apiTypes[key] === schema);

const getTypeName = (
  type: 'params' | 'response',
  apiTypes: Record<string, TJoiSchema>,
  typesStream: Writable,
  typeName: string,
  handler: THandler,
) => {
  const schema = type === 'params' ?
    handler.paramsSchema :
    handler.responseSchema;
  const types = getTypes(schema);
  if (!types) return '';

  const predefinedSchema = findPredefinedSchema(apiTypes, schema);
  if (predefinedSchema) return 'P.I' + predefinedSchema.replace('Schema', '');

  const typeNameExport = type === 'params' ?
    typeName :
    typeName + 'Response';
  if (SIMPLE_TYPES.includes(types)) return types;
  typesStream.write(
    tpl.strExportTypes(typeNameExport, types),
  );
  return types && 'Q.' + typeNameExport;
};
