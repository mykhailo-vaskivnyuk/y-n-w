import { IRequest } from './types';
import { format } from 'node:util';

export const getUrlInstance = (
  pathnameWithSearchString = '/',
  host = 'somehost',
) => new URL(pathnameWithSearchString, `http://${host}`);

export const getLog = (req: IRequest, resLog = '') => {
  const { pathname } = getUrlInstance(req.url, req.headers.host);
  return format('%s %s', req.method, pathname, '-', resLog);
};
