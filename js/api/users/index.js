"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const joi_1 = __importDefault(require("joi"));
const create = async (context, { name }) => {
    return { name };
};
create.params = {
    name: joi_1.default.string().required(),
    field: joi_1.default.number(),
};
create.schema = joi_1.default.object(create.params);
const update = () => {
    return execQuery.user.getUsers([]);
};
module.exports = { create, update };
//# sourceMappingURL=index.js.map