"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLog = exports.getUrlInstance = void 0;
const node_util_1 = require("node:util");
const getUrlInstance = (pathnameWithSearchString = '/', host = 'somehost') => {
    return new URL(pathnameWithSearchString, `http://${host}`);
};
exports.getUrlInstance = getUrlInstance;
const getLog = (req, resLog = '') => {
    const { pathname } = (0, exports.getUrlInstance)(req.url, req.headers.host);
    return (0, node_util_1.format)('%s %s', req.method, pathname, '-', resLog);
};
exports.getLog = getLog;
//# sourceMappingURL=utils.js.map