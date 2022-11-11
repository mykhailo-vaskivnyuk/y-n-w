export const LOGGER_LEVEL_MAP = {
  FATAL: 'fatal',
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};
export type TLoggerLevelKeys = keyof typeof LOGGER_LEVEL_MAP;
