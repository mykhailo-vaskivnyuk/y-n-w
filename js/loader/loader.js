"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = exports.loadModule = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_vm_1 = __importDefault(require("node:vm"));
const custom_require_1 = require("./custom.require");
const utils_1 = require("./utils");
const loadModule = (parentModule) => (modulePath, modulesContext, mode = false) => {
    const parentModuleDir = node_path_1.default.dirname(parentModule.filename);
    return (0, exports.loader)(modulePath, parentModuleDir, modulesContext, mode);
};
exports.loadModule = loadModule;
const loader = (modulePath, parentModuleDir, modulesContext, mode = false) => {
    const moduleFullPath = (0, utils_1.resolve)(parentModuleDir, modulePath);
    if (!moduleFullPath)
        return require(modulePath);
    (0, utils_1.log)(moduleFullPath);
    const moduleFullDir = node_path_1.default.dirname(moduleFullPath);
    const script = node_fs_1.default.readFileSync(moduleFullPath).toString();
    const module = { exports: {} };
    let newRequire;
    const context = {
        require: null,
        console,
        module,
        exports: module.exports,
        __filename: moduleFullPath,
        __dirname: moduleFullDir,
        ...modulesContext,
    };
    if (mode === 'isolate_all') {
        newRequire = ((modulePath) => (0, exports.loader)(modulePath, moduleFullDir, modulesContext, mode));
    }
    else {
        newRequire = (0, custom_require_1.customRequire)(moduleFullDir, context);
    }
    context.require = newRequire;
    node_vm_1.default.createContext(context);
    node_vm_1.default.runInContext(script, context, { displayErrors: true });
    return module.exports;
};
exports.loader = loader;
//# sourceMappingURL=loader.js.map