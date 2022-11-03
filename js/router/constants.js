"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULES_RESPONSE = exports.MODULES = void 0;
const path_1 = require("path");
const basePathModules = 'js/router/modules';
const basePathResponseModules = 'js/router/modules.response';
exports.MODULES = {
    getStream: (0, path_1.resolve)(basePathModules, 'get.stream'),
    validate: (0, path_1.resolve)(basePathModules, 'validate'),
    setSession: (0, path_1.resolve)(basePathModules, 'set.session'),
    setMailService: (0, path_1.resolve)(basePathModules, 'send.mail'),
};
exports.MODULES_RESPONSE = {
    validateResponse: (0, path_1.resolve)(basePathResponseModules, 'validate.response'),
};
//# sourceMappingURL=constants.js.map