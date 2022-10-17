"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const pg_1 = __importDefault(require("pg"));
class Connection {
    pool;
    constructor(config) {
        this.pool = new pg_1.default.Pool(config);
    }
    async connect() {
        await this.pool.connect();
    }
    query(sql, params) {
        return this.pool
            .query(sql, params)
            .then((result) => result.rows);
    }
}
module.exports = Connection;
//# sourceMappingURL=pg.js.map