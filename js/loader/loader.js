"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = exports.loadModule = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_vm_1 = __importDefault(require("node:vm"));
const utils_1 = require("./utils");
const options = { displayErrors: true };
const loadModule = (parentModule) => (modulePath, modulesContext) => {
    const __dirname = node_path_1.default.dirname(parentModule.filename);
    return (0, exports.loader)(modulePath, __dirname, modulesContext);
};
exports.loadModule = loadModule;
const loader = (modulePath, parentModuleDir, modulesContext) => {
    const __filename = (0, utils_1.resolve)(parentModuleDir, modulePath);
    if (!__filename)
        return require(modulePath);
    (0, utils_1.log)(__filename);
    const __dirname = node_path_1.default.dirname(__filename);
    const script = node_fs_1.default.readFileSync(__filename).toString();
    const module = { exports: {} };
    const newRequire = (modulePath) => (0, exports.loader)(modulePath, __dirname, modulesContext);
    const context = {
        require: newRequire,
        module,
        exports: module.exports,
        __filename,
        __dirname,
        ...modulesContext,
    };
    node_vm_1.default.createContext(context);
    node_vm_1.default.runInContext(script, context, options);
    return module.exports;
};
exports.loader = loader;
//# sourceMappingURL=loader.js.map