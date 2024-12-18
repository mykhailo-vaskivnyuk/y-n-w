import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { IControllerContext } from '../app/types';
import { log, resolve } from './utils';

const options = { displayErrors: true };

export const loadModule = (
  parentModuleDir: string,
  modulePath: string,
  { ...modulesContext } = {} as IControllerContext,
) => {
  try {
    return loader(modulePath, parentModuleDir, modulesContext);
  } finally {
    delete require.cache[__filename];
  }
};

export const loader = (
  modulePath: string,
  parentModuleDir: string,
  modulesContext?: IControllerContext,
) => {
  const __filename = resolve(parentModuleDir, modulePath);
  if (!__filename) return require(modulePath);
  log(__filename);
  const __dirname = path.dirname(__filename);
  const script = fs.readFileSync(__filename).toString();
  const module = { exports: {} };
  const nextRequire = (modulePath: string) =>
    loader(modulePath, __dirname, modulesContext);
  const context = {
    require: nextRequire,
    module,
    exports: module.exports,
    __filename,
    __dirname,
    ...modulesContext,
  };
  vm.createContext(context);
  vm.runInContext(script, context, options);
  return module.exports;
};
