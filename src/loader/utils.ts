import fs from 'node:fs';
import path from 'node:path';

export const use_strict = /("|')use strict("|');?/;
export const cwd = path.resolve(__dirname, '../..');
export const log = (moduleFullPath: string) =>
  logger.debug({}, 'loading module...', path.relative(cwd, moduleFullPath));

export const resolve = (parentModuleDir: string, modulePath: string) => {
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
