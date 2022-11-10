import path from 'node:path';
import vm from 'node:vm';
import { IModulesContext } from '../app/types';
import { TCache, TRequire } from './types';
import { getScriptInContext, log, resolve } from './utils';

const options = { displayErrors: true };
// const curDirName = __dirname;
const cache: TCache = {};

export const loadModule = (
  modulePath: string,
  { ...context } = {} as IModulesContext,
  mode?: 'isolate_all',
) => {
  const __dirname = require.main?.path || path.resolve('.');
  if (mode !== 'isolate_all') vm.createContext(context);
  const newRequire = getRequire(__dirname, context) as TRequire;
  newRequire.cache = {};
  newRequire.main = { path: __dirname };
  try {
    return newRequire(modulePath);
  } finally {
    delete require.cache[__filename];
  }
};

export const getRequire = (
  parentModuleDir: string,
  context: vm.Context | IModulesContext,
) => {
  const curRequire = ((modulePath: string) => {
    const __filename = resolve(parentModuleDir, modulePath);
    if (!__filename) return require(modulePath);
    const __dirname = path.dirname(__filename);
    if (__filename in (curRequire?.cache || {})) return cache[__filename];
    log(__filename);
    const scriptInContext = getScriptInContext(__filename);
    const newContext = !vm.isContext(context);
    const nextContext = newContext ? vm.createContext({ ...context }) : context;
    console.log(newContext);
    const newRequire = getRequire(__dirname, context) as TRequire;
    newRequire.cache = newContext ? {} as TCache : curRequire.cache;
    newRequire.main = { path: parentModuleDir };
    const module = { exports: {} };
    const contextParams = {
      global: nextContext,
      require: newRequire,
      module,
      exports: module.exports,
      __filename,
      __dirname,
    };
    const wrapper = vm.runInContext(scriptInContext, nextContext, options);
    wrapper(contextParams);
    newRequire.cache[__filename] = module.exports;
    return module.exports;
  }) as TRequire;
  return curRequire;
};
