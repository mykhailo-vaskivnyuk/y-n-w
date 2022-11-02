import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { IModulesContext } from '../app/types';

const resolve = (parentModuleDir: string, modulePath: string) => {
  if (path.isAbsolute(modulePath)) return addExt(modulePath);
  if (/^\./.test(modulePath)) return path.resolve(parentModuleDir, addExt(modulePath));
  if (/^node:/.test(modulePath)) return;
  const pathParts = [
    'node_modules',
    'lib',
    modulePath + '.js',
  ];
  const paths = parentModuleDir.split('/');
  while (paths.length) {
    const moduleFullPath = path.join(paths.join('/'), ...pathParts);
    try {
      fs.statSync(moduleFullPath);
      return moduleFullPath;
    } catch (e) {
      paths.pop();
    }
  }
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

const loader = (modulePath: string, parentModuleDir: string, modulesContext?: IModulesContext) => {
  const moduleFullPath = resolve(parentModuleDir, modulePath);
  if (!moduleFullPath) return require(modulePath);
  logger.debug({}, 'loading module...', path.relative(process.cwd(), moduleFullPath));
  const moduleFullDir = path.dirname(moduleFullPath);
  const script = fs.readFileSync(moduleFullPath).toString();
  const module = { exports: {} };
  const context = vm.createContext({
    require: (modulePath: string) => loader(modulePath, moduleFullDir, modulesContext),
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

const initialLoader = (modulePath: string, modulesContext?: IModulesContext) => {
  const parentModuleDir = require.main!.path;
  return loader(modulePath, parentModuleDir, modulesContext); 
}

export = initialLoader;
