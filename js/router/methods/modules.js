"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyResponseModules = exports.applyModules = void 0;
const constants_1 = require("../constants");
function applyModules(config) {
    const { modules, modulesConfig } = config;
    return modules.map((module) => {
        const moduleConfig = modulesConfig[module];
        const moduleExport = require(constants_1.MODULES[module]).default;
        return moduleExport(moduleConfig);
    });
}
exports.applyModules = applyModules;
const applyResponseModules = (config) => {
    const { responseModules, modulesConfig } = config;
    return responseModules.map((module) => {
        const moduleConfig = modulesConfig[module];
        const moduleExport = require(constants_1.MODULES_RESPONSE[module]).default;
        return moduleExport(moduleConfig);
    });
};
exports.applyResponseModules = applyResponseModules;
//# sourceMappingURL=modules.js.map