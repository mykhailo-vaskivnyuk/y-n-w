import pino = require('pino');
import { format } from 'util';
import { ILogger, TLoggerMethod } from '../app/types';
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
const TYPE: (keyof ILogger)[] = ['info', 'debug', 'warn', 'error', 'fatal'];

const getMethod = (type: keyof ILogger): TLoggerMethod => 
  (obj, ...message) => pinoLogger[type](obj, format(...message));

const logger = TYPE.reduce((logger, type) =>
  Object.assign(logger, { [type]: getMethod(type) }), {} as ILogger);

export = logger;
