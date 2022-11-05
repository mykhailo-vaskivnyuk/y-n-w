"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const process_1 = require("process");
const errors_1 = require("./errors");
const errors_2 = require("../db/errors");
const errors_3 = require("../router/errors");
const errors_4 = require("../server/http/errors");
const require_1 = require("../loader/require");
class App {
    config;
    logger;
    db;
    router;
    server;
    constructor(config) {
        process_1.env.NODE_ENV === 'development' && this.setEnv('.env.json');
        this.config = config;
        this.setUncaughtErrorHandlers();
    }
    async start() {
        try {
            this.setLogger();
            Object.assign(global, { logger: this.logger });
            logger.info('LOGGER IS READY');
            if (process_1.env.API_UNAVAILABLE === 'true')
                throw new errors_1.AppError('E_INIT');
            this.setDatabase();
            await this.db.init();
            logger.info('DATABASE IS READY');
            this.setRouter();
            await this.router.init();
            logger.info('ROUTER IS READY');
            this.setInputConnection();
            await this.server.start();
            logger.info('SERVER IS READY');
            process_1.env.RUN_ONCE === 'true' && process.exit(0);
        }
        catch (e) {
            await this.handleAppInitError(e);
        }
    }
    setEnv(envPath) {
        const envJson = node_fs_1.default
            .readFileSync(envPath)
            .toString();
        const envObj = JSON.parse(envJson);
        Object.assign(process_1.env, envObj);
    }
    setUncaughtErrorHandlers() {
        const uncaughtErrorHandler = (e) => {
            this.logger ?
                logger.fatal(e) :
                console.error(e);
            if (process_1.env.EXIT_ON_ERROR === 'false')
                return;
            process.nextTick(() => process.exit());
        };
        process.on('unhandledRejection', uncaughtErrorHandler);
        process.on('uncaughtException', uncaughtErrorHandler);
    }
    setLogger() {
        const { logger } = this.config;
        const Logger = require(logger.path);
        this.logger = new Logger(logger);
        return this;
    }
    setDatabase() {
        const { database } = this.config;
        const Database = require(database.path);
        this.db = new Database(database);
        return this;
    }
    setRouter() {
        const { router } = this.config;
        const logger = this.logger;
        const execQuery = this.db?.getQueries();
        if (!logger || !execQuery)
            throw new errors_1.AppError('E_INIT');
        const context = {
            logger,
            execQuery,
        };
        const Router = (0, require_1.loadModule)(router.path, context);
        this.router = new Router(router);
        return this;
    }
    setInputConnection() {
        const apiUnavailable = process_1.env.API_UNAVAILABLE === 'true';
        const staticUnavailable = process_1.env.STATIC_UNAVAILABLE === 'true';
        if (!this.router && !apiUnavailable)
            throw new errors_1.AppError('E_INIT');
        const { inConnection } = this.config;
        const { transport } = inConnection;
        const server = inConnection[transport];
        const InConnection = require(server.path);
        const handleOperation = async (operation) => {
            try {
                return await this.router?.exec(operation);
            }
            catch (e) {
                return (0, errors_1.handleOperationError)(e);
            }
        };
        this.server = new InConnection(server)
            .onOperation(handleOperation);
        apiUnavailable && this.server.setUnavailable('api');
        staticUnavailable && this.server.setUnavailable('static');
        return this;
    }
    async handleAppInitError(e) {
        const isKnown = [
            errors_2.DatabaseError.name,
            errors_3.RouterError.name,
            errors_4.ServerError.name,
            errors_1.AppError.name,
        ];
        if (!isKnown.includes(e.name))
            logger.error(e, e.message);
        if (!this.logger)
            throw new errors_1.AppError('E_START');
        try {
            this.setInputConnection();
            await this.server.start();
            this.logger.info('SERVER IS READY');
        }
        catch (e) {
            if (!isKnown.includes(e.name))
                logger.error(e, e.message);
            throw new errors_1.AppError('E_START');
        }
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map