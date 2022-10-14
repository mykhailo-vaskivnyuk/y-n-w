export const LOGGER_LEVEL = {
  FATAL: 'fatal',
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

export const LOGGER_TARGET = {
  CONSOLE: 'console',
  STDOUT: 'stdout',
};

export interface ILoggerConfig {
  level: typeof LOGGER_LEVEL[keyof typeof LOGGER_LEVEL],
  target: typeof LOGGER_TARGET[keyof typeof LOGGER_TARGET],
}
