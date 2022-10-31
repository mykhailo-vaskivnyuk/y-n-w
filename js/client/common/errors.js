"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponseError = exports.HttpResponseErrorEnum = exports.HttpResponseErrorMap = void 0;
const utils_1 = require("../../utils/utils");
exports.HttpResponseErrorMap = {
    400: 'Bad request',
    404: 'Not found',
    409: 'Conflict',
    500: 'Internal server error',
    503: 'Service unavailable',
};
exports.HttpResponseErrorEnum = (0, utils_1.getEnumFromMap)(exports.HttpResponseErrorMap);
class HttpResponseError extends Error {
    statusCode = 500;
    constructor(code) {
        super(exports.HttpResponseErrorMap[code]);
        this.statusCode = code;
        this.name = this.constructor.name;
    }
}
exports.HttpResponseError = HttpResponseError;
//# sourceMappingURL=errors.js.map