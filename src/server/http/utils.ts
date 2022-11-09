import { format } from 'node:util';
import { Readable } from 'node:stream';
import { IRequest } from '../types';

export const getUrlInstance = (
  pathnameWithSearchString = '/',
  host = 'somehost',
) => new URL(pathnameWithSearchString, `http://${host}`);

export const getLog = (req: IRequest, resLog = '') => {
  const { pathname } = getUrlInstance(req.url, req.headers.host);
  return format('%s %s', req.method, pathname, '-', resLog);
};

export const getJson = async (stream: Readable) => {
  const buffers: Uint8Array[] = [];
  for await (const chunk of stream) buffers.push(chunk as any);
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};

export const getifApi = (api: string) => (url = '') => {
  const regExp = new RegExp(`^/${api}(/.*)?$`);
  return regExp.test(url);
};
