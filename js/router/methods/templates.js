"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExport = exports.getMethod = exports.getImport = exports.getApi = void 0;
const node_util_1 = require("node:util");
const importTpl = 'import { %s } from \'./types\';\n';
const apiTpl = `import * as Types from './%s';

export const api = (
  fetch: <T>(pathname: string, options?: Record<string, any>) => Promise<T>
) => (`;
const methodTpl = '(options: %s) => fetch<%s>(\'%s\', options),';
const methodTplNoTypes = '() => fetch<%s>(\'%s\'),';
const exportTpl = 'export type %s = %s;\n';
const getApi = (fileName) => (0, node_util_1.format)(apiTpl, fileName);
exports.getApi = getApi;
const getImport = (typeName) => (0, node_util_1.format)(importTpl, typeName);
exports.getImport = getImport;
const getMethod = (typeName, responseTypeName, nextPathname) => {
    return typeName
        ? (0, node_util_1.format)(methodTpl, typeName, responseTypeName, nextPathname)
        : (0, node_util_1.format)(methodTplNoTypes, responseTypeName, nextPathname);
};
exports.getMethod = getMethod;
const getExport = (paramsTypeName, paramsTypes) => (0, node_util_1.format)(exportTpl, paramsTypeName, paramsTypes);
exports.getExport = getExport;
//# sourceMappingURL=templates.js.map