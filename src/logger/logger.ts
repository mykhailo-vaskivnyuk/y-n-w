import pino = require('pino');
import {
  ILogger, ILoggerConfig,
  LOGGER_LEVEL, TLoggerParameters,
} from './types';
import { createErrorlog, createLog } from './utils';

class Logger implements ILogger {
  private logger;

  constructor(config: ILoggerConfig) {
    const { level: levelKey, target } = config;
    const level = LOGGER_LEVEL[levelKey];
    const toConsole = { target: 'pino-pretty', level, options: {} };
    const toStdOut = {
      target: 'pino/file',
      level,
      options: { destination: 1 },
    };
    const transport =  target === 'stdout' ? toStdOut : toConsole;
    const options = { level, transport };
    this.logger = pino.default(options);
  }

  fatal(...message: TLoggerParameters) {
    const [error, errorMmessage] = createErrorlog(message);
    this.logger.fatal(error, errorMmessage);
  }

  error(...message: TLoggerParameters) {
    const [error, errorMmessage] = createErrorlog(message);
    this.logger.error(error, errorMmessage);
  }

  warn(...message: TLoggerParameters) {
    const [first, second] = createLog(message);
    this.logger.warn(first, second);
  }

  info(...message: TLoggerParameters) {
    const [first, second] = createLog(message);
    this.logger.info(first, second);
  }

  debug(...message: TLoggerParameters) {
    const [first, second] = createLog(message);
    this.logger.debug(first, second);
  }
}

export = Logger;
