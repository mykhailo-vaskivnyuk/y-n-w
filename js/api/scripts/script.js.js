"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const joi_1 = __importDefault(require("joi"));
const node_fs_1 = __importDefault(require("node:fs"));
const handler = async () => node_fs_1.default.createReadStream(module.filename);
handler.responseSchema = joi_1.default.object();
module.exports = handler;
//# sourceMappingURL=script.js.js.map