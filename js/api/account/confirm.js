"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const joi_1 = __importDefault(require("joi"));
const types_1 = require("../types");
const confirm = async (context, { link }) => {
    const [user] = await execQuery.user.findByLink([link]);
    if (!user)
        return null;
    await execQuery.user.unsetLink([user.user_id]);
    await context.session.write('user_id', user.user_id);
    return { ...user, confirmed: !user.link };
};
confirm.params = {
    link: joi_1.default.string(),
};
confirm.responseSchema = types_1.UserResponseSchema;
module.exports = confirm;
//# sourceMappingURL=confirm.js.map