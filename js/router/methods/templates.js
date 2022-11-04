"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strTypes = exports.strExportTypes = exports.strMethod = exports.strKey = exports.strGetApi = exports.strImport = void 0;
const node_util_1 = require("node:util");
const tplImport = 'import * as P from \'./types\';\n';
const tplGetApi = `import * as P from './types';
import * as Q from './%s';

export const getApi = (
  fetch: <T>(pathname: string, options?: Record<string, any>) => Promise<T>
) => (`;
const tplKey = '\n%s\'%s\': ';
const tplMethod = '(options: %s) => fetch<%s>(\'%s\', options),';
const tplMethodNoTypes = '() => fetch<%s>(\'%s\'),';
const tplExportTypes = 'export type %s = %s;\n';
const tplTypes = '\n%s  %s: %s;';
const strImport = (typeName) => (0, node_util_1.format)(tplImport, typeName);
exports.strImport = strImport;
const strGetApi = (fileName) => (0, node_util_1.format)(tplGetApi, fileName);
exports.strGetApi = strGetApi;
const strKey = (indent, key) => (0, node_util_1.format)(tplKey, indent, key);
exports.strKey = strKey;
const strMethod = (typeName, responseTypeName, nextPathname) => {
    return typeName
        ? (0, node_util_1.format)(tplMethod, typeName, responseTypeName, nextPathname)
        : (0, node_util_1.format)(tplMethodNoTypes, responseTypeName, nextPathname);
};
exports.strMethod = strMethod;
const strExportTypes = (paramsTypeName, paramsTypes) => (0, node_util_1.format)(tplExportTypes, paramsTypeName, paramsTypes);
exports.strExportTypes = strExportTypes;
const strTypes = (indent, key, type) => (0, node_util_1.format)(tplTypes, indent, key, type);
exports.strTypes = strTypes;
//# sourceMappingURL=templates.js.map