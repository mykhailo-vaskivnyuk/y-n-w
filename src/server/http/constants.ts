import { getEnumFromMap } from '../../utils/utils';

export const INDEX = 'index.html';
export const UNAVAILABLE = '503.html';
export const NOT_FOUND = '404.html';
export const JSON_TRANSFORM_LENGTH = 100;

export const HTTP_REQ_MODULES = {
  allowCors: 'allowCors.js',
  setSession: 'setSession.js',
  staticServer: 'staticServer.js',
  getOperation: 'getOperation.js',
};
export type THttpReqModulesKeys = keyof typeof HTTP_REQ_MODULES;

export const HTTP_RES_MODULES = {
  sendResponse: 'sendResponse.js',
};
export type THttpResModulesKeys = keyof typeof HTTP_RES_MODULES;

export const HEADERS = {
  // 'X-XSS-Protection': '1; mode=block',
  // 'X-Content-Type-Options': 'nosniff',
  // 'Strict-Transport-Security':
  //   'max-age=31536000; includeSubdomains; preload',
  // 'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Cookie',
  'Access-Control-Allow-Credentials': 'true',
  // 'Content-Type': 'application/json; charset=UTF-8',
};

export const RES_MIME_TYPES_MAP = {
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
export type ResMimeTypeKeys = keyof typeof RES_MIME_TYPES_MAP;

export const REQ_MIME_TYPES_MAP = {
  'application/json': { maxLength: 1_000 },
  'application/octet-stream': { maxLength: 1_000_000 },
};
export type ReqMimeTypesKeys = keyof typeof REQ_MIME_TYPES_MAP;
export const REQ_MIME_TYPES_ENUM = getEnumFromMap(REQ_MIME_TYPES_MAP);
