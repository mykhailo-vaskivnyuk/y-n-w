"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const errors_2 = require("../db/errors");
const errors_3 = require("../router/errors");
const errors_4 = require("../server/http/errors");
const loader_1 = require("../loader/loader");
class App {
    config;
    router;
    constructor(config) {
        this.config = config;
        this.setUncaughtErrorHandlers();
    }
    getLogger() {
        const { logger } = this.config;
        const Logger = require(logger.path);
        return new Logger(logger);
    }
    getDatabase() {
        const { database } = this.config;
        const Database = require(database.path);
        return new Database(database);
    }
    setRouter(modulesContext) {
        const { router } = this.config;
        const Router = (0, loader_1.loadModule)(module)(router.path, modulesContext);
        this.router = new Router(router, modulesContext);
        return this;
    }
    getInputConnection() {
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
        const newServer = new InConnection(server);
        newServer.onOperation(handleOperation);
        return newServer;
    }
    async start() {
        try {
            const logger = this.getLogger();
            Object.assign(global, { logger });
            logger.info('LOGGER IS READY');
            const db = this.getDatabase();
            const execQuery = await db.init();
            logger.info('DATABASE IS READY');
            this.setRouter({ execQuery, logger });
            await this.router.init();
            logger.info('ROUTER IS READY');
            await this.getInputConnection().start();
            logger.info('SERVER IS READY');
        }
        catch (e) {
            const isKnown = e instanceof errors_2.DatabaseError ||
                e instanceof errors_3.RouterError ||
                e instanceof errors_4.ServerError;
            if (!isKnown)
                logger.error(e);
            throw new errors_1.AppError(errors_1.AppErrorEnum.E_START);
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