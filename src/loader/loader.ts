import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { IModulesContext } from '../app/types';
import { customRequire } from './custom.require';
import { log, resolve } from './utils';

type TMode = 'isolate_all' | false;
export const loadModule = (parentModule: NodeJS.Module) => (
  modulePath: string,
  modulesContext?: IModulesContext,
  mode: TMode = false,
) => {
  const parentModuleDir = path.dirname(parentModule.filename);
  return loader(modulePath, parentModuleDir, modulesContext, mode);
}

export const loader = (
  modulePath: string,
  parentModuleDir: string,
  modulesContext?: IModulesContext,
  mode: TMode = false,
) => {
  const moduleFullPath = resolve(parentModuleDir, modulePath);
  if (!moduleFullPath) return require(modulePath);
  log(moduleFullPath);
  const moduleFullDir = path.dirname(moduleFullPath);
  const script = fs.readFileSync(moduleFullPath).toString();
  const module = { exports: {} };
  let newRequire;
  const context = {
    require: null as any,
    console,
    module,
    exports: module.exports,
    __filename: moduleFullPath,
    __dirname: moduleFullDir,
    ...modulesContext,
  };
  if (mode === 'isolate_all') {
    newRequire = ((modulePath: string) =>
      loader(modulePath, moduleFullDir, modulesContext, mode));
  } else {
    newRequire = customRequire(moduleFullDir, context);
  }
  context.require = newRequire;
  vm.createContext(context);
  vm.runInContext(script, context, { displayErrors: true });
  return module.exports;
};
