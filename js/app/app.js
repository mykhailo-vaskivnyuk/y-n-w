"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const db_1 = __importDefault(require("../db/db"));
const errors_1 = require("./errors");
const errors_2 = require("../db/errors");
const errors_3 = require("../router/errors");
const errors_4 = require("../server/errors");
class App {
    config;
    logger;
    db;
    router;
    inConnection;
    constructor(config) {
        this.config = config;
        this.setErrorHandlers();
    }
    setLogger(Logger) {
        this.logger = new Logger(this.config.logger);
        Object.assign(global, { logger: this.logger });
        logger.info('LOGGER IS READY');
        return this;
    }
    setDatabase(Connection) {
        this.db = new db_1.default(this.config.database);
        this.db.setConnection(Connection);
        return this;
    }
    setRouter(Router) {
        this.router = new Router(this.config.router);
        return this;
    }
    setInputConnection(InConnection) {
        this.inConnection = new InConnection(this.config.inConnection);
        this.inConnection.onOperation(async (operation) => {
            try {
                return await this.router.exec(operation);
            }
            catch (e) {
                const { code, message, details } = e;
                const errors = {
                    [errors_3.RouterErrorEnum.E_NO_ROUTE]: () => {
                        throw new errors_4.ServerError(errors_4.ServerErrorEnum.E_NOT_FOUND, details);
                    },
                    [errors_3.RouterErrorEnum.E_MODULE]: () => {
                        throw new errors_4.ServerError(errors_4.ServerErrorEnum.E_BED_REQUEST, details);
                    },
                };
                if (e instanceof errors_3.RouterError && code in errors)
                    errors[code]();
                else
                    logger.error(e);
                throw new errors_1.AppError(errors_1.AppErrorEnum.E_ROUTER, message);
            }
        });
        return this;
    }
    async start() {
        try {
            const execQuery = await this.db.init();
            Object.assign(global, { execQuery });
            logger.info('DATABASE IS READY');
            await this.router.init();
            logger.info('ROUTER IS READY');
            await this.inConnection.start();
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
    setErrorHandlers() {
        const uncaughtErrorHandler = (e) => {
            typeof logger !== 'undefined' ? logger.fatal(e) : console.error(e);
            process.nextTick(() => process.exit());
        };
        process.on('unhandledRejection', uncaughtErrorHandler);
        process.on('uncaughtException', uncaughtErrorHandler);
    }
}
module.exports = App;
//# sourceMappingURL=app.js.map