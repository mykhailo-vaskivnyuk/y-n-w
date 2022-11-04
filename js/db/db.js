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
    queries;
    constructor(config) {
        this.config = config;
    }
    async init() {
        const { connection } = this.config;
        const Connection = require(connection.path);
        this.connection = new Connection(connection);
        try {
            await this.connection.connect();
        }
        catch (e) {
            logger.error(e, e.message);
            throw new errors_1.DatabaseError('E_DB_CONNECTION');
        }
        try {
            const queries = await this.readQueries(this.config.queriesPath);
            this.queries = queries;
        }
        catch (e) {
            logger.error(e, e.message);
            throw new errors_1.DatabaseError('E_DB_INIT');
        }
    }
    getQueries() {
        if (!this.queries)
            throw new errors_1.DatabaseError('E_DB_INIT');
        return this.queries;
    }
    async readQueries(dirPath) {
        const query = {};
        const queryPath = node_path_1.default.resolve(dirPath);
        const dir = await promises_1.default.opendir(queryPath);
        for await (const item of dir) {
            const ext = node_path_1.default.extname(item.name);
            const name = node_path_1.default.basename(item.name, ext);
            if (item.isDirectory()) {
                const dirPath = node_path_1.default.join(queryPath, name);
                query[name] = await this.readQueries(dirPath);
                continue;
            }
            if (ext !== '.js')
                continue;
            const filePath = node_path_1.default.join(queryPath, item.name);
            const queries = this.createQueries(filePath);
            if (name === 'index')
                Object.assign(query, queries);
            else
                query[name] = queries;
        }
        return query;
    }
    createQueries(filePath) {
        let moduleExport = require(filePath);
        moduleExport = moduleExport.default || moduleExport;
        if (typeof moduleExport === 'string') {
            return this.sqlToQuery(moduleExport);
        }
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
                logger.error(e, e.message);
                throw new errors_1.DatabaseError('E_DB_QUERY');
            }
        };
    }
}
module.exports = Database;
//# sourceMappingURL=db.js.map