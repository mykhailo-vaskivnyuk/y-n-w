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
const log = (moduleFullPath) => logger.debug({}, 'loading ...', node_path_1.default.relative(exports.cwd, moduleFullPath));
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
};
exports.resolve = resolve;
const addExt = (moduleFullPath) => {
    const moduleExt = node_path_1.default.extname(moduleFullPath);
    if (!moduleExt)
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
  ({ global, require, module, exports, __filename, __dirname }) => {
  ${script}
  };`;
};
exports.getScriptInContext = getScriptInContext;
//# sourceMappingURL=utils.js.map