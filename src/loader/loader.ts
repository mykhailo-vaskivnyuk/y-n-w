import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { IModulesContext } from '../app/types';
import { log, resolve } from './utils';

const options = { displayErrors: true };

export const loadModule = (__dirname: string) => (
  modulePath: string,
  modulesContext?: IModulesContext,
) => loader(modulePath, __dirname, modulesContext);

export const loader = (
  modulePath: string,
  parentModuleDir: string,
  modulesContext?: IModulesContext,
) => {
  const __filename = resolve(parentModuleDir, modulePath);
  if (!__filename) return require(modulePath);
  log(__filename);
  const __dirname = path.dirname(__filename);
  const script = fs.readFileSync(__filename).toString();
  const module = { exports: {} };
  const newRequire = (modulePath: string) =>
    loader(modulePath, __dirname, modulesContext);
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
