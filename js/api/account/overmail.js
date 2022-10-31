"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const joi_1 = __importDefault(require("joi"));
const crypto_1 = require("../../utils/crypto");
const overmail = async (context, { email }) => {
    const [user] = await execQuery.user.findUserByEmail([email]);
    if (!user)
        return false;
    const token = (0, crypto_1.createUnicCode)(15);
    const { user_id, link } = user;
    const params = link
        ? [user_id, token, null]
        : [user_id, null, token];
    await execQuery.user.setLink([...params]);
    const type = link ? 'confirm' : 'restore';
    await context.sendMail[type](email, token);
    return true;
};
overmail.params = {
    email: joi_1.default.string().required(), //.email(),
};
overmail.responseSchema = joi_1.default.boolean();
module.exports = overmail;
//# sourceMappingURL=overmail.js.map