export const LOGGER_LEVEL_MAP = {
  FATAL: 'fatal',
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};
export type TLoggerLevelKeys = keyof typeof LOGGER_LEVEL_MAP;

export const COLORS_MAP: Record<TLoggerLevelKeys, string> = {
  FATAL: '0;41m',
  ERROR: '0;31m',
  WARN: '0;35m',
  INFO: '0;32m',
  DEBUG: '0;36m',
};
