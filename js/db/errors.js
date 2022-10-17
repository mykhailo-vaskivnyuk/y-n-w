"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = exports.DatabaseErrorEnum = exports.DatabaseErrorMap = void 0;
const utils_1 = require("../utils/utils");
exports.DatabaseErrorMap = {
    E_DB_CONNECTION: 'Connection to database is not set',
    E_DB_QUERY: 'Database query error',
    E_DB_INIT: 'Initialization error',
};
exports.DatabaseErrorEnum = (0, utils_1.getEnumFromMap)(exports.DatabaseErrorMap);
class DatabaseError extends Error {
    code;
    constructor(code) {
        super(exports.DatabaseErrorMap[code]);
        this.name = this.constructor.name;
        this.code = code;
    }
}
exports.DatabaseError = DatabaseError;
//# sourceMappingURL=errors.js.map