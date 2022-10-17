"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnumFromMap = void 0;
const getEnumFromMap = (map) => Object
    .keys(map)
    .reduce((obj, key) => {
    const value = isNaN(+key) ? key : +key;
    Object.assign(obj, { [key]: value });
    return obj;
}, {});
exports.getEnumFromMap = getEnumFromMap;
//# sourceMappingURL=utils.js.map