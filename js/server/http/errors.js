"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.StatusCodeMap = exports.ServerErrorEnum = exports.ServerErrorMap = void 0;
const utils_1 = require("../../utils/utils");
exports.ServerErrorMap = {
    E_NOT_FOUND: 'Not found',
    E_BED_REQUEST: 'Bad request',
    E_SERVER_ERROR: 'Internal server error',
    E_UNAVAILABLE: 'Service unavailable',
    E_NO_CALLBACK: 'onOperation callback is not set',
    E_LISTEN: 'CAN\'T start server',
    E_REDIRECT: 'REDIRECT',
};
exports.ServerErrorEnum = (0, utils_1.getEnumFromMap)(exports.ServerErrorMap);
exports.StatusCodeMap = {
    [exports.ServerErrorEnum.E_REDIRECT]: 301,
    [exports.ServerErrorEnum.E_NOT_FOUND]: 404,
    [exports.ServerErrorEnum.E_BED_REQUEST]: 400,
    [exports.ServerErrorEnum.E_SERVER_ERROR]: 500,
    [exports.ServerErrorEnum.E_UNAVAILABLE]: 503,
};
class ServerError extends Error {
    code;
    details;
    statusCode;
    constructor(code, details = null) {
        super(exports.ServerErrorMap[code]);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = exports.StatusCodeMap[code];
        this.details = details;
    }
    getMessage() {
        return this.details ? JSON.stringify(this.details) : this.message;
    }
}
exports.ServerError = ServerError;
//# sourceMappingURL=errors.js.map