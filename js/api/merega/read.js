"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const joi_1 = __importDefault(require("joi"));
const handler = async (context, data) => ({ ...data, from: 'merega' });
handler.responseSchema = joi_1.default.object();
module.exports = handler;
//# sourceMappingURL=read.js.map