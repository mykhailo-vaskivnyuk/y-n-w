"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadInContext = void 0;
const node_module_1 = require("node:module");
const node_path_1 = __importDefault(require("node:path"));
const node_vm_1 = __importDefault(require("node:vm"));
const utils_1 = require("./utils");
const loadInContext = (parentModule) => (modulePath, modulesContext) => {
    const moduleFullPath = (0, utils_1.resolve)(parentModule.filename, modulePath);
    if (!moduleFullPath)
        return require(modulePath);
    const moduleFullDir = node_path_1.default.dirname(moduleFullPath);
    const script = `
  'use strict';
  console.log(execQuery);
  (function ({ module, exports, require, __dirname, __filename }) {
    return require('C:/dev/node-y-n-w-back/js/router/router.js');
  })`;
    const module = new node_module_1.Module(moduleFullPath, parentModule);
    const moduleContext = node_vm_1.default.createContext({
        ...modulesContext,
        console,
    });
    const moduleWpapperParams = {
        require: module.require,
        __dirname: moduleFullDir,
        __filename: moduleFullPath,
        module,
        exports: module.exports,
    };
    // console.log(moduleContext);
    const moduleWrapper = node_vm_1.default.runInContext(script, moduleContext, { displayErrors: true });
    return moduleWrapper(moduleWpapperParams);
};
exports.loadInContext = loadInContext;
//# sourceMappingURL=simple.require.js.map