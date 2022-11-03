"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOperationError = exports.AppError = exports.AppErrorEnum = exports.AppErrorMap = void 0;
const errors_1 = require("../router/errors");
const errors_2 = require("../server/http/errors");
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
const handleOperationError = (e) => {
    const errors = {
        [errors_1.RouterErrorEnum.E_NO_ROUTE]: (details) => {
            throw new errors_2.ServerError(errors_2.ServerErrorEnum.E_NOT_FOUND, details);
        },
        [errors_1.RouterErrorEnum.E_MODULE]: (details) => {
            throw new errors_2.ServerError(errors_2.ServerErrorEnum.E_BED_REQUEST, details);
        },
        [errors_1.RouterErrorEnum.E_REDIRECT]: (details) => {
            throw new errors_2.ServerError(errors_2.ServerErrorEnum.E_REDIRECT, details);
        },
    };
    if (e instanceof errors_1.RouterError) {
        const { code, details } = e;
        code in errors && errors[code](details || {});
    }
    else
        logger.error(e);
    throw new AppError(exports.AppErrorEnum.E_ROUTER, e.message);
};
exports.handleOperationError = handleOperationError;
//# sourceMappingURL=errors.js.map