import { resolve } from 'path';
const basePathModules = 'js/server/http/modules';

export const HTTP_MODULES = {
  allowCors: resolve(basePathModules, 'allowCors'),
};

export const INDEX = 'index.html';
export const NOT_FOUND = '404.html';

export const HEADERS = {
  // 'X-XSS-Protection': '1; mode=block',
  // 'X-Content-Type-Options': 'nosniff',
  // 'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Cookie',
  'Access-Control-Allow-Credentials': 'true',
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