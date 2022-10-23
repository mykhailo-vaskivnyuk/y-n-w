import http from 'node:http';

export type IRequest = http.IncomingMessage;
export type IResponse = http.ServerResponse;
export type IServer = http.Server;

export const HEADERS = {
  // 'X-XSS-Protection': '1; mode=block',
  // 'X-Content-Type-Options': 'nosniff',
  // 'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  // 'Content-Type': 'application/json; charset=UTF-8',
};

export const MIME_TYPES = {
  default: 'application/octet-stream',
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  jpg: 'image/jpg',
  gif: 'image/gif',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
};

export const INDEX = 'index.html';
export const NOT_FOUND = '404.html';

export type THttpModule<T = any> = (config?: T) =>
  (req: IRequest, res: IResponse) => boolean;