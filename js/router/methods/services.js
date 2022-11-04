"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServices = void 0;
const constants_1 = require("../constants");
const getServices = (config) => {
    const { services, modulesConfig } = config;
    return services.reduce((contextObj, service) => {
        const moduleConfig = modulesConfig[service];
        const moduleExport = require(constants_1.SERVICES[service]).default;
        contextObj[service] = moduleExport(moduleConfig);
        return contextObj;
    }, {});
};
exports.getServices = getServices;
//# sourceMappingURL=services.js.map