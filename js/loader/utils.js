"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScriptInContext = exports.resolve = exports.log = exports.cwd = exports.use_strict = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
exports.use_strict = /("|')use strict("|');?/;
exports.cwd = node_path_1.default.resolve(__dirname, '../..');
const log = (moduleFullPath) => logger.debug({}, 'loading module...', node_path_1.default.relative(exports.cwd, moduleFullPath));
exports.log = log;
const resolve = (parentModuleDir, modulePath) => {
    if (node_path_1.default.isAbsolute(modulePath))
        return addExt(modulePath);
    if (/^node:/.test(modulePath))
        return;
    if (/(\/|\\)/.test(modulePath)) {
        const moduleFullPath = node_path_1.default.resolve(parentModuleDir, modulePath);
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
exports.resolve = resolve;
const addExt = (moduleFullPath) => {
    if (!node_path_1.default.extname(moduleFullPath))
        return moduleFullPath + '.js';
    try {
        node_fs_1.default.statSync(moduleFullPath);
        return moduleFullPath;
    }
    catch (e) {
        return moduleFullPath + '.js';
    }
};
const getScriptInContext = (__filename) => {
    const script = node_fs_1.default
        .readFileSync(__filename)
        .toString()
        .replace(exports.use_strict, '');
    return `
  'use strict';
  ({ require, module, exports, __filename, __dirname }) => {
  ${script}
  };`;
};
exports.getScriptInContext = getScriptInContext;
//# sourceMappingURL=utils.js.map