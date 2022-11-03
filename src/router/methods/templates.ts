import { format } from 'node:util';

const importTpl = 'import { %s } from \'./types\';\n';
const apiTpl = 
`import * as Types from './%s';

export const api = (
  fetch: <T>(pathname: string, options?: Record<string, any>) => Promise<T>
) => (`;
const methodTpl = '(options: %s) => fetch<%s>(\'%s\', options),';
const methodTplNoTypes = '() => fetch<%s>(\'%s\'),'
const exportTpl = 'export type %s = %s;\n';

export const getApi = (fileName: string) => format(apiTpl, fileName);
export const getImport = (typeName: string) => format(importTpl, typeName);

export const getMethod = (
  typeName: string | undefined,
  responseTypeName: string,
  nextPathname: string
) => {
  return typeName
    ? format(methodTpl, typeName, responseTypeName, nextPathname)
    : format(methodTplNoTypes, responseTypeName, nextPathname);
};
export const getExport = (paramsTypeName: string, paramsTypes: string) =>
  format(exportTpl, paramsTypeName, paramsTypes);