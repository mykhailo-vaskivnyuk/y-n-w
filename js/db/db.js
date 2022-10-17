"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = __importDefault(require("node:fs/promises"));
const errors_1 = require("./errors");
class Database {
    config;
    connection;
    constructor(config) {
        this.config = config;
    }
    async init() {
        try {
            await this.connection.connect();
        }
        catch (e) {
            logger.error(e);
            throw new errors_1.DatabaseError(errors_1.DatabaseErrorEnum.E_DB_CONNECTION);
        }
        try {
            return await this.getQueries(this.config.queriesPath);
        }
        catch (e) {
            logger.error(e);
            throw new errors_1.DatabaseError(errors_1.DatabaseErrorEnum.E_DB_INIT);
        }
    }
    setConnection(Connection) {
        this.connection = new Connection(this.config.connection);
        return this;
    }
    async getQueries(dirPath) {
        const query = {};
        const queryPath = node_path_1.default.resolve(dirPath);
        const dir = await promises_1.default.opendir(queryPath);
        for await (const item of dir) {
            const ext = node_path_1.default.extname(item.name);
            const name = node_path_1.default.basename(item.name, ext);
            if (item.isFile()) {
                if (ext !== '.js')
                    continue;
                const filePath = node_path_1.default.join(queryPath, name);
                const queries = this.createQueries(filePath);
                if (name === 'index')
                    Object.assign(query, queries);
                else
                    query[name] = queries;
            }
            else {
                const dirPath = node_path_1.default.join(queryPath, name);
                query[name] = await this.getQueries(dirPath);
            }
        }
        return query;
    }
    createQueries(filePath) {
        const moduleExport = require(filePath);
        return Object
            .keys(moduleExport)
            .reduce((queries, key) => {
            queries[key] = this.sqlToQuery(moduleExport[key]);
            return queries;
        }, {});
    }
    sqlToQuery(sql) {
        return async (params) => {
            try {
                return await this.connection.query(sql, params);
            }
            catch (e) {
                logger.error(e);
                throw new errors_1.DatabaseError(errors_1.DatabaseErrorEnum.E_DB_QUERY);
            }
        };
    }
}
module.exports = Database;
//# sourceMappingURL=db.js.map