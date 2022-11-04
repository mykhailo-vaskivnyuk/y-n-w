import path from 'node:path';
import vm from 'node:vm';
import { IModulesContext } from '../app/types';
import { getScriptInContext, log, resolve } from './utils';

const options = { displayErrors: true };
const cache = new Map();

export const loadModule = (parentModule: NodeJS.Module) => (
  modulePath: string,
  { ...context } = {} as IModulesContext,
) => {
  const __dirname = path.dirname(parentModule.filename);
  vm.createContext(context);
  const newRequire = customRequire(__dirname, context);
  return newRequire(modulePath);
};

export const customRequire = (
  moduleDir: string,
  context: vm.Context,
) => (modulePath: string) => {
  const __filename = resolve(moduleDir, modulePath);
  if (!__filename) return require(modulePath);
  const __dirname = path.dirname(__filename);
  if (cache.has(__filename)) return cache.get(__filename);
  log(__filename);
  const scriptInContext = getScriptInContext(__filename);
  const newRequire = customRequire(__dirname, context);
  const module = { exports: {} };
  const contextParams = {
    require: newRequire,
    module,
    exports: module.exports,
    __filename,
    __dirname,
  };
  vm.runInContext(scriptInContext, context, options)(contextParams);
  cache.set(__filename, module.exports);
  return module.exports;
};
