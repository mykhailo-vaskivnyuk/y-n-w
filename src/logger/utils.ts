/* eslint-disable indent */
import { format } from 'node:util';
import { TLoggerParameters } from './types';
import { COLORS_MAP } from './constants';

export const colorize = (message: string, color: keyof typeof COLORS_MAP) =>
  '\x1b[' + COLORS_MAP[color] + message + '\x1b[0m';

export const getFormatLog =
  (isColor: boolean) =>
  (message: TLoggerParameters, color: keyof typeof COLORS_MAP): any[] => {
    let first = {};
    let second = '';
    if (typeof message[0] === 'object') {
      first = message[0];
      second = format(...message.slice(1));
    } else {
      second = format(...message);
    }
    if (isColor) second = colorize(second, color);
    return [first, second];
  };

export const createErrorlog = (message: TLoggerParameters) => {
  const [e] = message;
  if (typeof e !== 'object') return message;
  let stack = e.stack as string;
  if (stack) {
    stack = stack
      .split('\n')
      .slice(1, 4)
      .map((item) => item.replace('at', '').trim())
      .join('\n');
    e.stack = stack;
  }
  if (e instanceof Error) return message;
  const isError = /error/i.test(e.name) || /error/i.test(e.type);
  if (!isError) return message;

  const error = new Error();
  error.message = e.message;
  error.stack = stack;
  message[0] = error;

  return message;
};
