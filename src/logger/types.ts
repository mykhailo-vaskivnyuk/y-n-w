import { TLoggerLevelKeys } from './constants';

export interface ILoggerConfig {
  path: string;
  level: TLoggerLevelKeys;
  target: TLoggerTarget;
  colorize: boolean;
}

type TLoggerTarget = 'console' | 'stdout';

export type ILogger = Record<TLoggerMethodName, TLoggerMethod>;

export type TLoggerMethodName = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type TLoggerMethod = <T>(
  object: T,
  ...message: TLoggerParameters
) => void;

export type TLoggerParameters = Parameters<typeof console.log>;
