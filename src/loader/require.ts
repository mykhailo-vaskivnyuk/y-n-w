import path from 'node:path';
import vm from 'node:vm';
import { IModulesContext } from '../app/types';
import { TCache, TRequire } from './types';
import { getScriptInContext, log, resolve } from './utils';

const options = { displayErrors: true };
const curDirName = __dirname;
const cache: TCache = {};

export const loadModule = (
  modulePath: string,
  { ...context } = {} as IModulesContext,
  mode?: 'isolate_all',
) => {
  const __dirname = require.main?.path || path.resolve('.');
  if (mode !== 'isolate_all') vm.createContext(context);
  const newRequire = getRequire(__dirname, context) as TRequire;
  try {
    return newRequire(modulePath);
  } finally {
    delete require.cache[__filename];
  }
};

export const getRequire = (
  moduleDir: string,
  context: vm.Context | IModulesContext,
) => (modulePath: string) => {
  const __filename = resolve(moduleDir, modulePath);
  if (!__filename) return require(modulePath);
  const __dirname = path.dirname(__filename);
  if (__filename in cache) return cache[__filename];
  log(__filename);
  const scriptInContext = getScriptInContext(__filename);
  const newRequire = getRequire(__dirname, context) as TRequire;
  newRequire.main = { path: curDirName };
  newRequire.cache = cache;
  const module = { exports: {} };
  if (!vm.isContext(context)) vm.createContext(context);
  const contextParams = {
    global: context,
    require: newRequire,
    module,
    exports: module.exports,
    __filename,
    __dirname,
  };
  const wrapper = vm.runInContext(scriptInContext, context, options);
  wrapper(contextParams);
  cache[__filename] = module.exports;
  return module.exports;
};
