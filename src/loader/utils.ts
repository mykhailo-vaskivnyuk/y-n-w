import fs from 'node:fs';
import path from 'node:path';

export const use_strict = /("|')use strict("|');?/;
export const cwd = path.resolve(__dirname, '../..');
export const log = (moduleFullPath: string, loadingString = 'loading ...') =>
  logger.debug(loadingString, path.relative(cwd, moduleFullPath));

export const resolve = (parentModuleDir: string, modulePath: string) => {
  if (/^node:/.test(modulePath)) return;
  if (path.isAbsolute(modulePath)) return addExt(modulePath);
  if (/(\/|\\)/.test(modulePath)) {
    const moduleFullPath = path.resolve(parentModuleDir, modulePath);
    return addExt(moduleFullPath);
  }
};

const addExt = (moduleFullPath: string) => {
  const moduleExt = path.extname(moduleFullPath);
  if (!moduleExt) return moduleFullPath + '.js';
  try {
    fs.statSync(moduleFullPath);
    return moduleFullPath;
  } catch (e) {
    return moduleFullPath + '.js';
  }
};

export const getScriptInContext = (__filename: string) => {
  const script = fs.readFileSync(__filename).toString().replace(use_strict, '');
  return `
  'use strict';
  ({ global, require, module, exports, __filename, __dirname }) => {
  ${script}
  };`;
};
