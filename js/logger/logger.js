"use strict";
const util_1 = require("util");
const pino = require("pino");
const types_1 = require("./types");
class Logger {
    logger;
    constructor(config) {
        const { level: levelKey, target } = config;
        const level = types_1.LOGGER_LEVEL[levelKey];
        const toConsole = { target: 'pino-pretty', level, options: {} };
        const toStdOut = {
            target: 'pino/file',
            level,
            options: { destination: 1 },
        };
        const transport = target === 'stdout' ? toStdOut : toConsole;
        const options = { level, transport };
        this.logger = pino.default(options);
    }
    fatal(obj, ...message) {
        this.logger.fatal(obj, (0, util_1.format)(...message));
    }
    error(obj, ...message) {
        this.logger.error(obj, (0, util_1.format)(...message));
    }
    warn(obj, ...message) {
        this.logger.warn(obj, (0, util_1.format)(...message));
    }
    info(obj, ...message) {
        this.logger.info(obj, (0, util_1.format)(...message));
    }
    debug(obj, ...message) {
        this.logger.debug(obj, (0, util_1.format)(...message));
    }
}
module.exports = Logger;
//# sourceMappingURL=logger.js.map