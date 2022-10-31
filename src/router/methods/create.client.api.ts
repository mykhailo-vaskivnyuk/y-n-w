
import path from 'node:path';
import fs from 'node:fs';
import { Writable } from 'node:stream';
import { isHandler } from '.';
import { IRouterConfig } from '../../app/types';
import { TPromiseExecutor } from '../../types';
import { isJoiSchema } from '../modules.response/validate.response';
import { IRoutes, THandler } from '../types';

const getTypeNameFromPathname = (pathname: string) => {
  const parts = pathname.replace('/', '').split('/');
  const name = parts.map((part) => part[0]?.toUpperCase() + part.slice(1)).join('');
  return 'T' + name.replace(/\./g, '_');
};

const getTypes = (params?: THandler['params'] | THandler['responseSchema'], indent = ''): string => {
  if (!params) return '';
  const result = [];
  if (isJoiSchema(params)) {
    let type = params.type || '';
    type = type === 'object' ? 'Record<string, any>' : type;
    type = type === 'any' ? `${[...(params as any)._valids._values.values()][0]}` : type;
    return type;
  }
  if (Array.isArray(params)) {
    return params.map((item) => getTypes(item, indent)).join(' | ');
  }
  const paramsEntries = Object.entries(params);
  for (const [key, param] of paramsEntries) {
    result.push(`\n${indent}  ${key}: ${getTypes(param, indent)};`);
  }
  return `{${result.join('')}\n${indent}}`;
};

export const getCreateJs = (config: IRouterConfig) => function createJs(routes: IRoutes, stream: Writable, typesStream: Writable, pathname = '', indent = '') {
  stream.write('{');
  const nextIndent = indent + '  ';
  const routesKeys = Object.keys(routes);
  for (const key of routesKeys) {
    stream.write(`\n${nextIndent}'${key}': `);
    const handler = routes[key] as THandler | IRoutes;
    const nextPathname = pathname + '/' + key;
    if (isHandler(handler)) {
      const types = getTypes(handler.params, nextIndent);
      const typeName = getTypeNameFromPathname(nextPathname);
      types && typesStream.write(`export type ${typeName} = ${types};\n`);
      const apiTypes = require(path.resolve(config.apiPath, 'types.js'));
      let [responseTypeName] = Object.entries(apiTypes).find(([, type]) => type === handler.responseSchema) || [];
      const typeNotFound = !responseTypeName;
      responseTypeName = responseTypeName && 'I' + responseTypeName.replace('Schema', '');
      const responseTypes = getTypes(handler.responseSchema, nextIndent);
      responseTypeName = responseTypeName || `${typeName}Response`;
      typeNotFound && responseTypes && typesStream.write(`export type ${responseTypeName} = ${responseTypes};\n`);
      typeNotFound && (responseTypeName = `Types.${responseTypeName}`);
      stream.write(
        `(${types ? `options: Types.${typeName}` : ''}) => fetch${responseTypes ? `<${responseTypeName}>` : ''}('${nextPathname}'${types ? ', options' : ''}),`
      );
    }
    else {
      createJs(handler, stream, typesStream, nextPathname, nextIndent);
      stream.write(',');
    }
  }
  stream.write('\n' + indent + '}');
};

export const createClientApi = (config: IRouterConfig, routes?: IRoutes) => {
  if (!routes) throw new Error('Routes is not put');
  const executor: TPromiseExecutor<void> = (rv, rj) => {
    const apiPath = config.clientApiPath;
    const apiFileNameBase = path.basename(apiPath, path.extname(apiPath));
    const typesFileNameBase = apiFileNameBase + '.types';
    const typesFileName = typesFileNameBase + '.ts';
    const typesPath = path.join(path.dirname(apiPath), typesFileName);
    const stream = fs.createWriteStream(apiPath);
    const typesStream = fs.createWriteStream(typesPath);
    let isFinish = false;
    const handleFinish = () => isFinish ? rv() : isFinish = true;
    stream.on('error', (e) => (typesStream.close(), rj(e)));
    stream.on('finish', handleFinish);
    typesStream.on('error', (e) => (stream.close(), rj(e)));
    typesStream.on('finish', handleFinish);
    const apiTypesPath = path.resolve(config.apiPath, 'types.js');
    const apiTypes = require(apiTypesPath);
    Object.keys(apiTypes).forEach((typeName) => stream.write(`import { I${typeName.replace('Schema', '')} } from './types';\n`));
    stream.write(
      `import * as Types from './${typesFileNameBase}';

export const api = (
fetch: <T>(pathname: string, options?: Record<string, any>) => Promise<T>
) => (`);

    getCreateJs(config)(routes!, stream, typesStream);
    stream.write(');\n');
    stream.close();
    typesStream.close();
  };

  return new Promise(executor);
}
