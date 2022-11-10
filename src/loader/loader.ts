import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { IRouterContext } from '../app/types';
import { TLoader } from './types';
import { log, resolve } from './utils';

const options = { displayErrors: true };
const curDiName = __dirname;

export const loadModule = (
  modulePath: string,
  modulesContext?: IRouterContext,
) => {
  const __dirname = require.main?.path || path.resolve('.');
  try {
    return loader(modulePath, __dirname, modulesContext);
  } finally {
    delete require.cache[__filename];
  }
};

export const loader = (
  modulePath: string,
  parentModuleDir: string,
  modulesContext?: IRouterContext,
) => {
  const __filename = resolve(parentModuleDir, modulePath);
  if (!__filename) return require(modulePath);
  log(__filename);
  const __dirname = path.dirname(__filename);
  const script = fs.readFileSync(__filename).toString();
  const module = { exports: {} };
  const newRequire = ((modulePath: string) =>
    loader(modulePath, __dirname, modulesContext)) as TLoader;
  newRequire.main.path = curDiName;
  const context = {
    global: this,
    require: newRequire,
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
