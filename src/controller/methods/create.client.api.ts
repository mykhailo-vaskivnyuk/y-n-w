import path from 'node:path';
import fs from 'node:fs';
import { Writable } from 'node:stream';
import { TPromiseExecutor } from '../../client/common/types';
import { IControllerConfig, IEndpoints, TJoiSchema, THandler } from '../types';
import * as tpl from './templates';
import { isHandler, getTypeName, getTypeNameFromPathname } from '../utils';

export const createClientApi = (
  config: IControllerConfig,
  endpoints: IEndpoints,
) => {
  const executor: TPromiseExecutor<void> = (rv, rj) => {
    const apiPath = config.clientApiPath;
    const apiExt = path.extname(apiPath);
    const apiDir = path.dirname(apiPath);
    const apiFileNameBase = path.basename(apiPath, apiExt);
    const typesFileNameBase = apiFileNameBase + '.types';
    const typesFileName = typesFileNameBase + '.ts';
    const typesPath = path.join(apiDir, 'types', typesFileName);
    const apiStream = fs.createWriteStream(apiPath);
    const typesStream = fs.createWriteStream(typesPath);
    let done = false;
    const handleFinish = () => (done ? rv() : (done = true));
    const handleError = (e: Error) => {
      apiStream.close();
      typesStream.close();
      rj(e);
    };
    apiStream.on('error', handleError);
    apiStream.on('finish', handleFinish);
    typesStream.on('error', handleError);
    typesStream.on('finish', handleFinish);
    const apiTypesPath = path.resolve(config.apiPath, 'schema/schema.js');
    const apiTypes = require(apiTypesPath) as Record<string, TJoiSchema>;
    apiStream.write(tpl.strGetApi(typesFileNameBase));
    typesStream.write(tpl.tplImport);
    createJs(apiTypes, apiStream, typesStream)(endpoints);
    apiStream.write(');\n');
    apiStream.close();
    typesStream.close();
  };

  return new Promise(executor);
};

export const createJs = (
  apiTypes: Record<string, TJoiSchema>,
  apiStream: Writable,
  typesStream: Writable,
) =>
  function createJs(endpoints: IEndpoints, pathname = '', indent = '') {
    apiStream.write('{');
    const nextIndent = indent + '  ';
    const routesKeys = Object.keys(endpoints);

    for (const key of routesKeys) {
      apiStream.write(tpl.strKey(nextIndent, key));
      const handler = endpoints[key] as THandler | IEndpoints;
      const nextPathname = pathname + '/' + key;
      if (!isHandler(handler)) {
        createJs(handler, nextPathname, nextIndent);
        apiStream.write(',');
        continue;
      }
      const typeName = getTypeNameFromPathname(nextPathname);
      const paramsTypeName = getTypeName(
        'params',
        apiTypes,
        typesStream,
        typeName,
        handler,
      );
      const responseTypeName = getTypeName(
        'response',
        apiTypes,
        typesStream,
        typeName,
        handler,
      );
      apiStream.write(
        tpl.strMethod(
          paramsTypeName,
          responseTypeName,
          nextPathname,
          nextIndent,
        ),
      );
    }

    apiStream.write('\n' + indent + '}');
  };
