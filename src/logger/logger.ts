import pino = require('pino');
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

const logger = pino.default(options);

export = logger;
