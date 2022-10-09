import pino = require('pino');
import { format } from 'util';
import { ILogger } from '../app/types';
// const { LOG_LEVEL, LOG_TARGET } = require('./configService');
// const { LOGGER_TARGET } = require('./configService');

const LOGGER_LEVEL = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

const LOGGER_TARGET = {
  CONSOLE: 'console',
  STDOUT: 'stdout',
};

const level = LOGGER_LEVEL.DEBUG; // LOG_LEVEL;
const toConsole = { target: 'pino-pretty', level, options: {} };
const toStdOut = { target: 'pino/file', level, options: { destination: 1 } };
const transport = toConsole; // LOG_TARGET === LOGGER_TARGET.STDOUT ? toStdOut : toConsole;
const options = { level, transport };

const pinoLogger = pino.default(options);
const logger: ILogger = {
  info: (obj, ...message) => pinoLogger.info(obj, format(...message)),
  debug: (obj, ...message) => pinoLogger.debug(obj, format(...message)),
  warn: (obj, ...message) => pinoLogger.warn(obj, format(...message)),
  error: (obj, ...message) => pinoLogger.error(obj, format(...message)),
  fatal: (obj, ...message) => pinoLogger.debug(obj, format(...message)),
}

export = logger;
