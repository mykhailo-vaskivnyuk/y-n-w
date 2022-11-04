"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIMPLE_TYPES = exports.SERVICES = exports.MODULES_RESPONSE = exports.MODULES = void 0;
const path_1 = require("path");
const basePathModules = 'js/router/modules';
const basePathResponseModules = 'js/router/modules.response';
const basePathServices = 'js/router/services';
exports.MODULES = {
    getStream: (0, path_1.resolve)(basePathModules, 'get.stream.js'),
    validate: (0, path_1.resolve)(basePathModules, 'validate.js'),
    setSession: (0, path_1.resolve)(basePathModules, 'set.session.js'),
};
exports.MODULES_RESPONSE = {
    validateResponse: (0, path_1.resolve)(basePathResponseModules, 'validate.response.js'),
};
exports.SERVICES = {
    mailService: (0, path_1.resolve)(basePathServices, 'send.mail.js'),
};
exports.SIMPLE_TYPES = ['boolean', 'string', 'number'];
//# sourceMappingURL=constants.js.map