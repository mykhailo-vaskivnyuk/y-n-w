"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSON_TRANSFORM_LENGTH = exports.REQ_MIME_TYPES_ENUM = exports.REQ_MIME_TYPES_MAP = exports.RES_MIME_TYPES = exports.HEADERS = exports.NOT_FOUND = exports.UNAVAILABLE = exports.INDEX = exports.HTTP_MODULES = void 0;
const path_1 = require("path");
const utils_1 = require("../../utils/utils");
const basePathModules = 'js/server/http/modules';
exports.HTTP_MODULES = {
    allowCors: (0, path_1.resolve)(basePathModules, 'allowCors.js'),
    staticServer: (0, path_1.resolve)(basePathModules, 'staticServer.js'),
};
exports.INDEX = 'index.html';
exports.UNAVAILABLE = '503.html';
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
exports.RES_MIME_TYPES = {
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
exports.REQ_MIME_TYPES_MAP = {
    'application/json': { maxLength: 1_000 },
    'application/octet-stream': { maxLength: 1_000_000 },
};
exports.REQ_MIME_TYPES_ENUM = (0, utils_1.getEnumFromMap)(exports.REQ_MIME_TYPES_MAP);
exports.JSON_TRANSFORM_LENGTH = 100;
//# sourceMappingURL=constants.js.map