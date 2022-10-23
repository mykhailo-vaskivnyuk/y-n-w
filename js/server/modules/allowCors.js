"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowCors = void 0;
const types_1 = require("../types");
const allowCors = () => (req, res) => {
    const { method } = req;
    if (method?.toLocaleLowerCase() === 'options') {
        res.writeHead(200, types_1.HEADERS);
        res.end();
        return false;
    }
    Object
        .keys(types_1.HEADERS)
        .forEach((key) => res.setHeader(key, types_1.HEADERS[key]));
    return true;
};
exports.allowCors = allowCors;
//# sourceMappingURL=allowCors.js.map