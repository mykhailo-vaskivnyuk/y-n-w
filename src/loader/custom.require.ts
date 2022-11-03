import path from 'node:path';
import fs from 'node:fs';
import vm from 'node:vm';
import { log, resolve, use_strict } from './utils';
import { TRequire } from './types';

export const customRequire = (
  moduleDir: string,
  context: vm.Context,
) => (modulePath: string) => {
  const moduleFullPath = resolve(moduleDir, modulePath);
  if (!moduleFullPath) return require(modulePath);
  log(moduleFullPath);
  const moduleFullDir = path.dirname(moduleFullPath);
  const script = fs
    .readFileSync(moduleFullPath)
    .toString()
    .replace(use_strict, '');
  const module = { exports: {} };
  const newRequire = customRequire(moduleFullDir, context) as TRequire;
  newRequire.main = { path: moduleDir, type: 'require' };
  const scriptParams = {
    require: newRequire,
    module,
    exports: module.exports,
    __filename: moduleFullPath,
    __dirname: moduleFullDir,
  };
  const scriptInContext =`
  (() => ({ module, exports, require, __filename, __dirname }) => {
    ${script}
  })()`;
  vm.runInContext(scriptInContext, context)(scriptParams);
  return module.exports;
};
