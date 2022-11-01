
import path from 'node:path';
import fs from 'node:fs';
import { Writable } from 'node:stream';
import Joi from 'joi';
import { isHandler } from '../utils';
import { IRouterConfig } from '../../app/types';
import { TPromiseExecutor } from '../../types';
import { isJoiSchema } from '../modules.response/validate.response';
import { IRoutes, JoiSchema, THandler } from '../types';
import { getApi, getExport, getImport, getMethod } from './templates';

export const createClientApi = (config: IRouterConfig, routes?: IRoutes) => {
  if (!routes) throw new Error('Routes is not set');
  const executor: TPromiseExecutor<void> = (rv, rj) => {
    const apiPath = config.clientApiPath;
    const apiFileNameBase = path.basename(apiPath, path.extname(apiPath));
    const typesFileNameBase = apiFileNameBase + '.types';
    const typesFileName = typesFileNameBase + '.ts';
    const typesPath = path.join(path.dirname(apiPath), typesFileName);
    const apistream = fs.createWriteStream(apiPath);
    const typesStream = fs.createWriteStream(typesPath);
    let isFinish = false;
    const handleFinish = () => isFinish ? rv() : isFinish = true;
    const handleError = (e: Error) => {
      apistream.close();
      typesStream.close();
      rj(e);
    }
    apistream.on('error', handleError);
    apistream.on('finish', handleFinish);
    typesStream.on('error', handleError);
    typesStream.on('finish', handleFinish);
    const apiTypesPath = path.resolve(config.apiPath, 'types.js');
    const apiTypes = require(apiTypesPath) as Record<string, JoiSchema>;
    Object
      .keys(apiTypes)
      .map((schemaName) => 'I' + schemaName.replace('Schema', ''))
      .forEach((typeName) => apistream.write(getImport(typeName)));
    apistream.write(getApi(typesFileNameBase));
    createJs(apiTypes, apistream, typesStream)(routes!);
    apistream.write(');\n');
    apistream.close();
    typesStream.close();
  };
  
  return new Promise(executor);
};

export const createJs = (
  apiTypes: Record<string, JoiSchema>,
  apiStream: Writable,
  typesStream: Writable
) => function createJs(routes: IRoutes, pathname = '', indent = '') {
  apiStream.write('{');
  const nextIndent = indent + '  ';
  const routesKeys = Object.keys(routes);

  for (const key of routesKeys) {
    apiStream.write(`\n${nextIndent}'${key}': `);
    const handler = routes[key] as THandler | IRoutes;
    const nextPathname = pathname + '/' + key;

    if (!isHandler(handler)) {
      createJs(handler, nextPathname, nextIndent);
      apiStream.write(',');
      continue;
    }
    
    const typeName = getTypeNameFromPathname(nextPathname);
    const paramsTypeNameExport = typeName;
    const responseTypeNameExport = typeName + 'Response';

    const paramsTypes = getTypes(handler.paramsSchema, nextIndent);
    const paramsTypeName = paramsTypes && 'Types.' + paramsTypeNameExport;
    paramsTypes && typesStream.write(getExport(paramsTypeNameExport, paramsTypes));

    const responseSchema = handler.responseSchema;

    const predefinedResponseSchema = Object.keys(apiTypes)
      .find((key) => apiTypes[key] === responseSchema);
    if (predefinedResponseSchema) {
      const responseTypeName = 'I' + predefinedResponseSchema.replace('Schema', '');
      apiStream.write(getMethod(paramsTypeName, responseTypeName, nextPathname));
      continue;
    }
      
    const responseTypes = getTypes(responseSchema, nextIndent);
    if (!responseTypes) throw new Error(`Handler ${nextPathname} dosn't have response schema`);
    typesStream.write(getExport(responseTypeNameExport, responseTypes));
    const responseTypeName = 'Types.' + responseTypeNameExport;
    apiStream.write(getMethod(paramsTypeName, responseTypeName, nextPathname));
  }
  apiStream.write('\n' + indent + '}');
};

const getTypeNameFromPathname = (pathname: string) => {
  return 'T' + pathname
    .replace('/', '')
    .replace(/\./g, '_')
    .split('/')
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join('');
};

const getTypes = (
  schema?: THandler['paramsSchema'] | THandler['responseSchema'],
  indent = ''
): string | undefined => {
  if (!schema) return;
  
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
  const result = schemaEntries.map(([key, item]) =>
    `\n${indent}  ${key}: ${getTypes(item, indent)};`);
  return '{' + result.join('') + '\n' + indent + '}';
};

const getSchemaType = (schema: Joi.Schema) => {
  const schemaValuesSet = (schema as any)._valids._values;
  const [type] = [...schemaValuesSet.values()];
  return type;
};
