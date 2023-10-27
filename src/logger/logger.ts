import pino = require('pino');
import { ILogger, ILoggerConfig, TLoggerParameters } from './types';
import { LOGGER_LEVEL_MAP } from './constants';
import { createErrorlog, getFormatLog } from './utils';

class Logger implements ILogger {
  private logger;
  private formatLog: ReturnType<typeof getFormatLog>;

  constructor(config: ILoggerConfig) {
    const { level: levelKey, target, colorize } = config;
    const level = LOGGER_LEVEL_MAP[levelKey];
    const toConsole = { target: 'pino-pretty', level, options: {} };
    const toStdOut = {
      target: 'pino/file',
      level,
      options: { destination: 1 },
    };
    const transport = target === 'stdout' ? toStdOut : toConsole;
    const options = { level, transport };
    this.logger = pino.default(options);
    this.formatLog = getFormatLog(colorize);
  }

  fatal(...message: TLoggerParameters) {
    const e = createErrorlog(message);
    const [obj, mess] = this.formatLog(e, 'FATAL');
    this.logger.fatal(obj, mess);
  }

  error(...message: TLoggerParameters) {
    const e = createErrorlog(message);
    const [obj, mess] = this.formatLog(e, 'ERROR');
    this.logger.error(obj, mess);
  }

  warn(...message: TLoggerParameters) {
    const e = createErrorlog(message);
    const [obj, mess] = this.formatLog(e, 'WARN');
    this.logger.warn(obj, mess);
  }

  info(...message: TLoggerParameters) {
    const [obj, mess] = this.formatLog(message, 'INFO');
    this.logger.info(obj, mess);
  }

  debug(...message: TLoggerParameters) {
    const [obj, mess] = this.formatLog(message, 'DEBUG');
    this.logger.debug(obj, mess);
  }
}

export = Logger;
