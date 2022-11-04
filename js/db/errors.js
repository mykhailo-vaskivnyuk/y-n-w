"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = exports.DatabaseErrorMap = void 0;
exports.DatabaseErrorMap = {
    E_DB_CONNECTION: 'Connection to database is not set',
    E_DB_QUERY: 'Database query error',
    E_DB_INIT: 'Initialization error',
};
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