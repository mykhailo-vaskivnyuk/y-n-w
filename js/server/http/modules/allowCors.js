"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowCors = void 0;
const constants_1 = require("../constants");
const allowCors = () => (req, res) => {
    const { method } = req;
    if (method?.toLocaleLowerCase() === 'options') {
        res.writeHead(200, constants_1.HEADERS);
        res.end();
        return false;
    }
    Object
        .keys(constants_1.HEADERS)
        .forEach((key) => res.setHeader(key, constants_1.HEADERS[key]));
    return true;
};
exports.allowCors = allowCors;
//# sourceMappingURL=allowCors.js.map