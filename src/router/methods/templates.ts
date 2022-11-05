import { format } from 'node:util';

const tplImport = 'import * as P from \'./types\';\n';
const tplGetApi =
`import * as P from './types';
import * as Q from './%s';

export const getApi = (
  fetch: <T>(pathname: string, options?: Record<string, any>) => Promise<T>
) => (`;
const tplKey = '\n%s\'%s\': ';
const tplMethod = '(options: %s) =>\n  %sfetch<%s>(\'%s\', options),\n';
const tplMethodNoTypes = '() => fetch<%s>(\'%s\'),\n';
const tplExportTypes = 'export type %s = %s;\n';
const tplTypes = '\n%s  %s: %s;';

export const strImport = (typeName: string) => format(tplImport, typeName);
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
