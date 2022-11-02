import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import util from 'node:util';
import { IModulesContext } from '../app/types';

type TMode = 'isolate_all' | false;

type TRequire = {
  (modulePath: string): any;
  main: {
    path: string;
  };
};


export const loadModule = (modulePath: string, modulesContext?: IModulesContext, mode: TMode = false) => {
  const parentModuleDir = require.main!.path;
  return loader(modulePath, parentModuleDir, modulesContext, mode); 
}

const loader = (modulePath: string, parentModuleDir: string, modulesContext?: IModulesContext, mode: TMode = false) => {
  const moduleFullPath = resolve(parentModuleDir, modulePath);
  if (!moduleFullPath) return require(modulePath);
  logger.debug({}, 'loading module...', path.relative(process.cwd(), moduleFullPath));
  const moduleFullDir = path.dirname(moduleFullPath);
  const script = fs.readFileSync(moduleFullPath).toString();
  const module = { exports: {} };
  const nextRequire = (mode === 'isolate_all'
    ? (modulePath: string) => loader(modulePath, moduleFullDir, modulesContext)
    : customRequire(moduleFullDir, modulesContext)) as TRequire;
  nextRequire.main = { path: moduleFullDir };
  const context = vm.createContext({
    require: nextRequire, 
    console,
    module,
    exports: module.exports,
    __filename: moduleFullPath,
    __dirname: moduleFullDir,
    logger,
    ...modulesContext,
  });
  vm.runInContext(script, context, { displayErrors: true });
  return module.exports;
};

const resolve = (parentModuleDir: string, modulePath: string) => {
  if (path.isAbsolute(modulePath)) return addExt(modulePath);
  if (/^node:/.test(modulePath)) return;
  if (/(\/|\\)/.test(modulePath)) {
    const moduleFullPath = path.resolve(parentModuleDir, modulePath);
    return addExt(moduleFullPath);
  }

  // return require.resolve(modulePath);

  // const pathParts = [
  //   'node_modules',
  //   modulePath,
  //   'package.json',
  // ];
  // let searchPath = parentModuleDir;
  // while (searchPath.length > 3) {
  //   try {
  //     const packageJsonPath = path.join(searchPath, ...pathParts);
  //     const packageJson = fs.readFileSync(packageJsonPath).toString();
  //     const moduleName = JSON.parse(packageJson).main;
  //     const moduleFullPath = path.join(packageJsonPath, '..', moduleName);
  //     fs.statSync(moduleFullPath);
  //     return moduleFullPath;
  //   } catch (e) {
  //     searchPath = path.resolve(searchPath, '..');
  //   }
  // }
};

const addExt = (moduleFullPath: string) => {
  if (!path.extname(moduleFullPath)) return moduleFullPath + '.js';
  try {
    fs.statSync(moduleFullPath);
    return moduleFullPath;
  } catch (e) {
    return moduleFullPath + '.js';
  }
};

const customRequire = (moduleDir: string, modulesContext?: IModulesContext) => (modulePath: string) => {
  const moduleFullPath = resolve(moduleDir, modulePath);
  if (!moduleFullPath) return require(modulePath);
  logger.debug({}, 'loading module...', path.relative(process.cwd(), moduleFullPath));
  const moduleFullDir = path.dirname(moduleFullPath);
  const script = fs.readFileSync(moduleFullPath).toString().replace(/("|')use strict("|');?/, '');
  const module = { exports: {} };
  const nextRequire = customRequire(moduleFullDir) as TRequire;
  nextRequire.main = { path: moduleDir };
  const context = {
    require: nextRequire,
    module,
    exports: module.exports,
    __filename: moduleFullPath,
    __dirname: moduleFullDir,
    ...modulesContext,
  };
  const modulesContextFields = Object.keys(modulesContext || {}).join(',');
  const tpl =`
  (() => ({ module, exports, require, __filename, __dirname${modulesContextFields && ','} ${modulesContextFields} }) => {
    %s
  })()`;
  const scriptWithContext = util.format(tpl, script);
  const moduleWithContext = new vm.Script(scriptWithContext).runInThisContext();
  moduleWithContext(context);
  return module.exports;
}
