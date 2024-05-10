import path from 'node:path';
import vm from 'node:vm';
import { IControllerContext } from '../app/types';
import { TRequire } from './types';
import { getScriptInContext, log, resolve } from './utils';

const options = { displayErrors: true };

export const loadModule = (
  parentModuleDir: string,
  modulePath: string,
  { ...context } = {} as IControllerContext,
  mode?: 'isolate_all',
) => {
  if (mode !== 'isolate_all') vm.createContext(context);
  const __dirname = parentModuleDir;
  const newRequire = getRequire(__dirname, context);
  newRequire.cache = {};
  try {
    return newRequire(modulePath);
  } finally {
    delete require.cache[__filename];
  }
};

export const getRequire = (
  moduleDir: string,
  context: vm.Context | IControllerContext,
) => {
  const curRequire = ((modulePath: string) => {
    const __filename = resolve(moduleDir, modulePath);
    if (!__filename) return require(modulePath);
    const { cache } = curRequire;
    if (__filename in cache) {
      log(__filename, 'loading from cache ...');
      return cache[__filename];
    }
    const __dirname = path.dirname(__filename);
    log(__filename, 'loading ...');
    const scriptInContext = getScriptInContext(__filename);
    const newContext = !vm.isContext(context);
    const nextContext = newContext ? vm.createContext({ ...context }) : context;
    const nextRequire = getRequire(__dirname, context);
    nextRequire.cache = newContext ? {} : curRequire.cache;
    const module = { exports: {} };
    const contextParams = {
      require: nextRequire,
      module,
      exports: module.exports,
      __filename,
      __dirname,
    };
    const wrapper = vm.runInContext(scriptInContext, nextContext, options);
    wrapper(contextParams);
    cache[__filename] = module.exports;
    return module.exports;
  }) as TRequire;
  return curRequire;
};
