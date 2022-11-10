export interface ILoggerConfig {
  path: string;
  level: keyof typeof LOGGER_LEVEL,
  target: 'console' | 'stdout',
}

export const LOGGER_LEVEL = {
  FATAL: 'fatal',
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

export type TLoggerMethodName =
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal';

export type TLoggerParameters = Parameters<typeof console.log>;

export type TLoggerMethod =
  <T>(object: T, ...message: TLoggerParameters) => void;

export type ILogger = Record<TLoggerMethodName, TLoggerMethod>;
