"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customRequire = exports.loadModule = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_vm_1 = __importDefault(require("node:vm"));
const utils_1 = require("./utils");
const options = { displayErrors: true };
const cache = new Map();
const loadModule = (__dirname) => (modulePath, { ...context } = {}) => {
    node_vm_1.default.createContext(context);
    const newRequire = (0, exports.customRequire)(__dirname, context);
    return newRequire(modulePath);
};
exports.loadModule = loadModule;
const customRequire = (moduleDir, context) => (modulePath) => {
    const __filename = (0, utils_1.resolve)(moduleDir, modulePath);
    if (!__filename)
        return require(modulePath);
    const __dirname = node_path_1.default.dirname(__filename);
    if (cache.has(__filename))
        return cache.get(__filename);
    (0, utils_1.log)(__filename);
    const scriptInContext = (0, utils_1.getScriptInContext)(__filename);
    const newRequire = (0, exports.customRequire)(__dirname, context);
    const module = { exports: {} };
    const contextParams = {
        global: context,
        require: newRequire,
        module,
        exports: module.exports,
        __filename,
        __dirname,
    };
    const wrapper = node_vm_1.default.runInContext(scriptInContext, context, options);
    wrapper(contextParams);
    cache.set(__filename, module.exports);
    return module.exports;
};
exports.customRequire = customRequire;
//# sourceMappingURL=custom.require.js.map