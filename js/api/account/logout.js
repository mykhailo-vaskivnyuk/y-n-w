"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const joi_1 = __importDefault(require("joi"));
const logout = async (context) => {
    await context.session.clear();
    return true;
};
logout.responseSchema = joi_1.default.boolean();
module.exports = logout;
//# sourceMappingURL=logout.js.map