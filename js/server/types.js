"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOT_FOUND = exports.INDEX = exports.MIME_TYPES = exports.HEADERS = void 0;
exports.HEADERS = {
    // 'X-XSS-Protection': '1; mode=block',
    // 'X-Content-Type-Options': 'nosniff',
    // 'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    // 'Content-Type': 'application/json; charset=UTF-8',
};
exports.MIME_TYPES = {
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
exports.INDEX = 'index.html';
exports.NOT_FOUND = '404.html';
//# sourceMappingURL=types.js.map