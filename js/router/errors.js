"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlerError = exports.HandlerErrorMap = exports.RouterError = exports.RouterErrorMap = void 0;
exports.RouterErrorMap = {
    E_ROUTER: 'ROUTER ERROR',
    E_ROUTES: 'CAN\'T CREATE ROUTES',
    E_NO_ROUTE: 'CAN\'T FIND ROUTE',
    E_MODULE: 'MODULE ERROR',
    E_HANDLER: 'CAN\'T HANDLE OPERATION',
    E_REDIRECT: 'REDIRECT',
};
class RouterError extends Error {
    code;
    details;
    constructor(code, details = null) {
        super(exports.RouterErrorMap[code]);
        this.name = this.constructor.name;
        this.code = code;
        this.details = details;
    }
}
exports.RouterError = RouterError;
exports.HandlerErrorMap = {
    E_REDIRECT: 'REDIRECT',
};
class HandlerError extends Error {
    code;
    details;
    constructor(code, details = null) {
        super(exports.HandlerErrorMap[code]);
        this.name = this.constructor.name;
        this.code = code;
        this.details = details;
    }
}
exports.HandlerError = HandlerError;
//# sourceMappingURL=errors.js.map