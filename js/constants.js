"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSON_TRANSFORM_LENGTH = exports.MIME_TYPES_ENUM = exports.MIME_TYPES_MAP = void 0;
const utils_1 = require("./utils/utils");
exports.MIME_TYPES_MAP = {
    'application/json': { maxLength: 1_000 },
    'application/octet-stream': { maxLength: 1_000_000 },
};
exports.MIME_TYPES_ENUM = (0, utils_1.getEnumFromMap)(exports.MIME_TYPES_MAP);
exports.JSON_TRANSFORM_LENGTH = 100;
//# sourceMappingURL=constants.js.map