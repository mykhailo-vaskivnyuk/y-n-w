"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/* eslint-disable @typescript-eslint/ban-ts-comment */
const joi_1 = __importDefault(require("joi"));
const create = async (context, { name }) => {
    return { name };
};
create.schema = joi_1.default.object({
    name: joi_1.default.string().required(),
});
const update = () => {
    return execQuery.user.getUsers([]);
};
module.exports = { create, update };
//# sourceMappingURL=index.js.map