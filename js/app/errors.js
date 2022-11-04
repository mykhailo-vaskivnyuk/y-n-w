"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOperationError = exports.AppError = exports.AppErrorMap = void 0;
const errors_1 = require("../router/errors");
const errors_2 = require("../server/http/errors");
exports.AppErrorMap = {
    E_START: 'CAN\'T START APP',
    E_ROUTER: 'ROUTER ERROR',
    E_INIT: 'APP IS NOT INITIALIZED',
};
class AppError extends Error {
    code;
    constructor(code, message = '') {
        super(message || exports.AppErrorMap[code]);
        this.name = this.constructor.name;
        this.code = code;
    }
}
exports.AppError = AppError;
const errors = {
    E_NO_ROUTE: (details) => {
        throw new errors_2.ServerError('E_NOT_FOUND', details);
    },
    E_MODULE: (details) => {
        throw new errors_2.ServerError('E_BED_REQUEST', details);
    },
    E_REDIRECT: (details) => {
        throw new errors_2.ServerError('E_REDIRECT', details);
    },
};
const handleOperationError = (e) => {
    if (e.name === errors_1.RouterError.name) {
        const { code, details } = e;
        code in errors && errors[code](details);
    }
    else
        logger.error(e, e.message);
    throw new AppError('E_ROUTER', e.message);
};
exports.handleOperationError = handleOperationError;
//# sourceMappingURL=errors.js.map