import { format } from 'node:util';
import { TLoggerParameters } from './types';
import { COLORS_MAP } from './constants';

export const createLog = (message: TLoggerParameters): any[] => {
  const [firstParameter, ...rest] = message;
  if (typeof firstParameter === 'object')
    return [firstParameter, format(...rest)];
  return [{}, format(...message)];
};

export const createErrorlog = (message: TLoggerParameters) => {
  const [e, errorMessage] = createLog(message);
  let stack = (e.stack || '') as string;
  stack = stack
    .split('\n')
    .slice(1, 2)
    .map((item) => item.replace('at', '').trim())
    .join('\n');
  if (e instanceof Error) {
    e.stack = stack;
    return [e, errorMessage];
  }
  const name = (e.name as string || '').toLowerCase();
  const type = (e.type as string || '').toLowerCase();
  const isError = name.includes('error') || type.includes('error');
  if (!isError) return [e, errorMessage];
  const error = new Error();
  Object.assign(error, e);
  error.stack = stack;
  return [error, errorMessage];
};

export const colorize = (
  message: string, color: keyof typeof COLORS_MAP,
) => '\x1b[' + COLORS_MAP[color] + message + '\x1b[0m';
