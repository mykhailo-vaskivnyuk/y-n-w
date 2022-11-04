"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.ErrorStatusCodeMap = exports.ServerErrorMap = void 0;
exports.ServerErrorMap = {
    E_NOT_FOUND: 'Not found',
    E_BED_REQUEST: 'Bad request',
    E_SERVER_ERROR: 'Internal server error',
    E_UNAVAILABLE: 'Service unavailable',
    E_NO_CALLBACK: 'onOperation callback is not set',
    E_LISTEN: 'Can\'t start server',
    E_REDIRECT: 'Redirect',
};
exports.ErrorStatusCodeMap = {
    E_REDIRECT: 301,
    E_NOT_FOUND: 404,
    E_BED_REQUEST: 400,
    E_SERVER_ERROR: 500,
    E_UNAVAILABLE: 503,
};
class ServerError extends Error {
    code;
    details;
    statusCode;
    constructor(code, details = null) {
        super(exports.ServerErrorMap[code]);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = exports.ErrorStatusCodeMap[code];
        this.details = details;
    }
    getMessage() {
        return this.details ? JSON.stringify(this.details) : this.message;
    }
}
exports.ServerError = ServerError;
//# sourceMappingURL=errors.js.map