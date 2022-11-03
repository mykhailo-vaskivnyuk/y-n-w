"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIME_TYPES = exports.HEADERS = exports.NOT_FOUND = exports.INDEX = exports.HTTP_MODULES = void 0;
const path_1 = require("path");
const basePathModules = 'js/server/http/modules';
exports.HTTP_MODULES = {
    allowCors: (0, path_1.resolve)(basePathModules, 'allowCors'),
};
exports.INDEX = 'index.html';
exports.NOT_FOUND = '404.html';
exports.HEADERS = {
    // 'X-XSS-Protection': '1; mode=block',
    // 'X-Content-Type-Options': 'nosniff',
    // 'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Cookie',
    'Access-Control-Allow-Credentials': 'true',
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
//# sourceMappingURL=constants.js.map