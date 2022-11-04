import { format } from 'node:util';

const tplImport = 'import { %s } from \'./types\';\n';
const tplGetApi = 
`import * as Types from './%s';

export const getApi = (
  fetch: <T>(pathname: string, options?: Record<string, any>) => Promise<T>
) => (`;
const tplKey = '\n%s\'%s\': '
const tplMethod = '(options: %s) => fetch<%s>(\'%s\', options),';
const tplMethodNoTypes = '() => fetch<%s>(\'%s\'),'
const tplExport = 'export type %s = %s;\n';
const tplTypes = '\n%s  %s: %s;';

export const strImport = (typeName: string) => format(tplImport, typeName);
export const strGetApi = (fileName: string) => format(tplGetApi, fileName);
export const strKey = (indent: string, key: string) => format(tplKey, indent, key);
export const strMethod = (
  typeName: string | undefined,
  responseTypeName: string,
  nextPathname: string,
) => {
  return typeName
    ? format(tplMethod, typeName, responseTypeName, nextPathname)
    : format(tplMethodNoTypes, responseTypeName, nextPathname);
};
export const strExport = (
  paramsTypeName: string,
  paramsTypes: string,
) => format(tplExport, paramsTypeName, paramsTypes);

export const strTypes = (
  indent: string,
  key: string,
  type: string,
) => format(tplTypes, indent, key, type);
