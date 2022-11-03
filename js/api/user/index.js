"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const joi_1 = __importDefault(require("joi"));
const create = async (context, { name }) => {
    return { name };
};
create.paramsSchema = {
    name: joi_1.default.string().required(),
    field: joi_1.default.number(),
};
create.responseSchema = {
    name: joi_1.default.string(),
};
const update = async () => {
    return '';
};
update.responseSchema = joi_1.default.string();
module.exports = { create, update };
//# sourceMappingURL=index.js.map