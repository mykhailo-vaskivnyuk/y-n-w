"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const joi_1 = __importDefault(require("joi"));
const crypto_1 = require("../../utils/crypto");
const types_1 = require("../types");
const login = async (context, { email, password }) => {
    const [user] = await execQuery.user.findUserByEmail([email]);
    if (!user)
        return null;
    if (!user.password)
        return null;
    const isVerified = await (0, crypto_1.verifyHash)(password, user.password);
    if (!isVerified)
        return null;
    await context.session.write('user_id', user.user_id);
    return { ...user, confirmed: !user.link };
};
login.params = {
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
};
login.responseSchema = types_1.UserResponseSchema;
module.exports = login;
//# sourceMappingURL=login.js.map