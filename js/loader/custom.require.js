"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customRequire = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_vm_1 = __importDefault(require("node:vm"));
const utils_1 = require("./utils");
// import { TRequire } from './types';
const customRequire = (moduleDir, context) => (modulePath) => {
    const moduleFullPath = (0, utils_1.resolve)(moduleDir, modulePath);
    if (!moduleFullPath)
        return require(modulePath);
    (0, utils_1.log)(moduleFullPath);
    const moduleFullDir = node_path_1.default.dirname(moduleFullPath);
    const script = node_fs_1.default
        .readFileSync(moduleFullPath)
        .toString()
        .replace(utils_1.use_strict, '');
    const module = { exports: {} };
    const newRequire = (0, exports.customRequire)(moduleFullDir, context);
    const scriptParams = {
        require: newRequire,
        module,
        exports: module.exports,
        __filename: moduleFullPath,
        __dirname: moduleFullDir,
    };
    const scriptInContext = `
  (() => ({ module, exports, require, __filename, __dirname }) => {
    ${script}
  })()`;
    node_vm_1.default.runInContext(scriptInContext, context)(scriptParams);
    return module.exports;
};
exports.customRequire = customRequire;
//# sourceMappingURL=custom.require.js.map