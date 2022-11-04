"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const errors_2 = require("../db/errors");
const errors_3 = require("../router/errors");
const errors_4 = require("../server/http/errors");
const custom_require_1 = require("../loader/custom.require");
class App {
    config;
    logger;
    db;
    router;
    server;
    constructor(config) {
        this.config = config;
        this.setUncaughtErrorHandlers();
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
        const Router = (0, custom_require_1.loadModule)(__dirname)(router.path, context);
        this.router = new Router(router);
        return this;
    }
    setInputConnection() {
        if (!this.router)
            throw new errors_1.AppError('E_INIT');
        const { inConnection } = this.config;
        const { transport } = inConnection;
        const server = inConnection[transport];
        const InConnection = require(server.path);
        const handleOperation = async (operation) => {
            try {
                return await this.router.exec(operation);
            }
            catch (e) {
                return (0, errors_1.handleOperationError)(e);
            }
        };
        this.server = new InConnection(server)
            .onOperation(handleOperation);
        return this;
    }
    async start() {
        try {
            this.setLogger();
            Object.assign(global, { logger: this.logger });
            logger.info('LOGGER IS READY');
            this.setDatabase();
            await this.db.init();
            logger.info('DATABASE IS READY');
            this.setRouter();
            await this.router.init();
            logger.info('ROUTER IS READY');
            this.setInputConnection();
            await this.server.start();
            logger.info('SERVER IS READY');
        }
        catch (e) {
            const isKnown = e instanceof errors_2.DatabaseError ||
                e.name === errors_3.RouterError.name ||
                e instanceof errors_4.ServerError;
            if (!isKnown)
                logger.error(e, e.message);
            throw new errors_1.AppError('E_START');
        }
    }
    setUncaughtErrorHandlers() {
        const uncaughtErrorHandler = (e) => {
            typeof logger !== 'undefined'
                ? logger.fatal(e)
                : console.error(e);
            process.nextTick(() => process.exit());
        };
        process.on('unhandledRejection', uncaughtErrorHandler);
        process.on('uncaughtException', uncaughtErrorHandler);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map