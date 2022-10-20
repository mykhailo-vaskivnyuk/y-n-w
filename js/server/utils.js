"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlInstance = void 0;
const getUrlInstance = (pathnameWithSearchString = '/', host = 'somehost') => {
    return new URL(pathnameWithSearchString, `http://${host}`);
};
exports.getUrlInstance = getUrlInstance;
//# sourceMappingURL=utils.js.map