/* eslint-disable max-lines */
import { Writable } from 'node:stream';
import Joi from 'joi';
import { IRoutes, TJoiSchema, THandler, THandlerSchema } from './types';
import { SIMPLE_TYPES } from './constants';
import * as tpl from './methods/templates';

export const isHandler = (
  handler?: IRoutes | THandler,
): handler is THandler => typeof handler === 'function';

export const getTypeNameFromPathname = (pathname: string) => 'T' + pathname
  .replace('/', '')
  .replace(/\./g, '')
  .split('/')
  .map((part) => part[0]?.toUpperCase() + part.slice(1))
  .join('');

export const getTypeName = (
  type: 'params' | 'response',
  apiTypes: Record<string, TJoiSchema>,
  typesStream: Writable,
  typeName: string,
  handler: THandler,
) => {
  const schema = type === 'params' ?
    handler.paramsSchema :
    handler.responseSchema;
  const types = getTypes(apiTypes, schema);
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

export const outputSchemaToSchema = (
  schema: THandler['responseSchema'],
): TJoiSchema => {
  if (isJoiSchema(schema)) return schema;
  if (Array.isArray(schema)) {
    return schema.map((item) => outputSchemaToSchema(item) as Joi.Schema);
  }

  const resultSchema = { ...schema };
  for (const key in resultSchema) {
    if (isJoiSchema(resultSchema[key])) continue;
    Object.assign(resultSchema, {
      [key]: outputSchemaToSchema(
        resultSchema[key] as THandler['responseSchema'],
      ),
    });
  }
  return Joi.object(resultSchema);
};

const findPredefinedSchema = (
  apiTypes: Record<string, TJoiSchema>,
  schema: THandlerSchema,
) => Object
  .keys(apiTypes)
  .find((key) => apiTypes[key] === schema);

const getTypes = (
  apiTypes: Record<string, TJoiSchema>,
  schema?: THandlerSchema,
  indent = '',
): string => {
  if (!schema) return '';

  const predefinedSchema = findPredefinedSchema(apiTypes, schema);
  if (predefinedSchema) return 'P.I' + predefinedSchema.replace('Schema', '');

  if (isJoiSchema(schema)) {
    let type = schema.type || '';
    if (type === 'object') type = 'Record<string, any>';
    else if (type === 'any') type = getSchemaType(schema);
    return type;
  }

  if (Array.isArray(schema)) {
    return schema
      .map((item) => getTypes(apiTypes, item, indent))
      .join(' | ');
  }

  const schemaEntries = Object.entries(schema);
  const types = schemaEntries
    .map(([key, item]) => {
      const types = getTypes(apiTypes, item, indent + '  ');
      isJoiSchema(item) && !(item as any)._flags?.presence && (key += '?');
      return tpl.strTypes(indent, key, types);
    });
  return '{' + types.join('') + '\n' + indent + '}';
};

const isJoiSchema = (
  schema: THandlerSchema,
): schema is Joi.Schema => Joi.isSchema(schema);

const getSchemaType = (schema: Joi.Schema) => {
  if (!(schema as any)._valids) return 'undefined';
  const schemaValuesSet = (schema as any)._valids?._values;
  const [type] = [...schemaValuesSet.values()];
  return `${type}`;
};
