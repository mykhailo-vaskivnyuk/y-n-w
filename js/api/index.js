"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const joi_1 = __importDefault(require("joi"));
const index = async () => 'hello FROM merega';
index.responseSchema = joi_1.default.string();
module.exports = { index };
//# sourceMappingURL=index.js.map