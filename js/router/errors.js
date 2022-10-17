"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterError = exports.RouterErrorEnum = exports.RouterErrorMap = void 0;
const utils_1 = require("../utils/utils");
exports.RouterErrorMap = {
    E_ROUTER: 'ROUTER ERROR',
    E_ROUTES: 'CAN\'T CREATE ROUTES',
    E_NO_ROUTE: 'CAN\'T FIND ROUTE',
    E_MODULE: 'MODULE ERROR',
    E_HANDLER: 'CAN\'T HANDLE OPERATION',
};
exports.RouterErrorEnum = (0, utils_1.getEnumFromMap)(exports.RouterErrorMap);
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
//# sourceMappingURL=errors.js.map