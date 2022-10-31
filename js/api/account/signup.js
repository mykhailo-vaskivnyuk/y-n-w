"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const joi_1 = __importDefault(require("joi"));
const crypto_1 = require("../../utils/crypto");
const types_1 = require("../types");
const signup = async (context, { email }) => {
    let [user] = await execQuery.user.findUserByEmail([email]);
    if (user)
        return null;
    const hashedPassword = await (0, crypto_1.createHash)('12345');
    const link = (0, crypto_1.createUnicCode)(15);
    await execQuery.user.createUser([email, hashedPassword, link]);
    [user] = await execQuery.user.findUserByEmail([email]);
    if (!user)
        throw new Error('Unknown error');
    context.session.write('user_id', user.user_id);
    await context.sendMail.confirm(email, link);
    return { ...user, confirmed: !user.link };
};
signup.params = {
    email: joi_1.default.string().required(), //.email(),
};
signup.responseSchema = types_1.UserResponseSchema;
module.exports = signup;
//# sourceMappingURL=signup.js.map