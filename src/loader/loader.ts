import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const resolve = (parentModuleDir: string, modulePath: string) => {
  if (path.isAbsolute(modulePath)) return addExt(modulePath);
  if (/^\./.test(modulePath)) return path.resolve(parentModuleDir, addExt(modulePath));
  if (/^node:/.test(modulePath)) return;
  const paths = parentModuleDir.split('/');
  while (paths.length) {
    try {
      const moduleFullPath = path.join(paths.join('/'), 'node_modules', 'lib', modulePath + '.js')
      fs.statSync(moduleFullPath);
      return moduleFullPath;
    } catch (e) {
      paths.pop();
      continue;
    }
  }
};

const addExt = (moduleFullPath: string) =>
  path.extname(moduleFullPath) ? moduleFullPath : moduleFullPath + '.js';

const loader = (modulePath: string, parentModuleDir: string) => {
  const moduleFullPath = resolve(parentModuleDir, modulePath);
  if (!moduleFullPath) return require(modulePath);

  console.log('require:', moduleFullPath);
  const moduleFullDir = path.dirname(moduleFullPath);
  const script = fs.readFileSync(moduleFullPath).toString();
  const module = { exports: {} };
  const context = vm.createContext({
    require: (modulePath: string) => loader(modulePath, moduleFullDir),
    console,
    module,
    __filename: moduleFullPath,
  });
  vm.runInContext(script, context);
  return module.exports;
};

const initialLoader = (modulePath: string) => {
  const parentModuleDir = require.main!.path;
  return loader(modulePath, parentModuleDir); 
}

export = initialLoader;
