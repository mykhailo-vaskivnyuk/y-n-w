"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.AppErrorEnum = exports.AppErrorMap = void 0;
const utils_1 = require("../utils/utils");
exports.AppErrorMap = {
    E_START: 'CAN\'T START APP',
    E_SETUP: 'WRONG APP SETUP',
    E_ROUTER: 'ROUTER ERROR',
};
exports.AppErrorEnum = (0, utils_1.getEnumFromMap)(exports.AppErrorMap);
class AppError extends Error {
    code;
    constructor(code, message = '') {
        super(message || exports.AppErrorMap[code]);
        this.name = this.constructor.name;
        this.code = code;
    }
}
exports.AppError = AppError;
//# sourceMappingURL=errors.js.map