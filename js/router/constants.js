"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULES_RESPONSE_ENUM = exports.MODULES_RESPONSE = exports.MODULES_ENUM = exports.MODULES = void 0;
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils/utils");
const basePathModules = 'js/router/modules';
const basePathResponseModules = 'js/router/modules.response';
exports.MODULES = {
    getStream: path_1.default.resolve(basePathModules, 'get.stream'),
    validate: path_1.default.resolve(basePathModules, 'validate'),
    setSession: path_1.default.resolve(basePathModules, 'set.session'),
    setMailService: path_1.default.resolve(basePathModules, 'send.mail'),
};
exports.MODULES_ENUM = (0, utils_1.getEnumFromMap)(exports.MODULES);
exports.MODULES_RESPONSE = {
    validateResponse: path_1.default.resolve(basePathResponseModules, 'validate.response'),
};
exports.MODULES_RESPONSE_ENUM = (0, utils_1.getEnumFromMap)(exports.MODULES_RESPONSE);
//# sourceMappingURL=constants.js.map