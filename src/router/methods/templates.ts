import { format } from 'node:util';

export const tplImport = 'import * as P from \'./types\';\n\n';
const tplGetApi =
`/* eslint-disable max-len */
import * as P from './types/types';
import * as Q from './types/%s';

export type IClientApi = ReturnType<typeof getApi>;

export const getApi = (
  fetch: <T>(pathname: string, options?: Record<string, any>) => Promise<T>
) => (`;
const tplKey = '\n%s\'%s\': ';
const tplMethod = '(options: %s) =>\n  %sfetch<%s>(\'%s\', options),\n';
const tplMethodNoTypes = '() => fetch<%s>(\'%s\'),\n';
const tplExportTypes = 'export type %s = %s;\n';
const tplTypes = '\n%s  %s: %s;';

export const strGetApi = (fileName: string) => format(tplGetApi, fileName);
export const strKey = (
  indent: string,
  key: string
) => format(tplKey, indent, key);
export const strMethod = (
  typeName: string | undefined,
  responseTypeName: string,
  nextPathname: string,
  indent: string,
) => (typeName ?
  format(tplMethod, typeName, indent, responseTypeName, nextPathname) :
  format(tplMethodNoTypes, responseTypeName, nextPathname));
export const strExportTypes = (
  paramsTypeName: string,
  paramsTypes: string,
) => format(tplExportTypes, paramsTypeName, paramsTypes);

export const strTypes = (
  indent: string,
  key: string,
  type: string,
) => format(tplTypes, indent, key, type);
