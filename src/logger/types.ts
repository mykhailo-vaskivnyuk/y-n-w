export const LOGGER_LEVEL = {
  FATAL: 'fatal',
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

export interface ILoggerConfig {
  path: string;
  level: keyof typeof LOGGER_LEVEL,
  target: 'console' | 'stdout',
}
