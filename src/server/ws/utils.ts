import { format } from 'node:util';

export const getLog = (
  pathname: string | undefined, resLog: string,
) => format('WS %s %s', pathname || '', '-', resLog);
