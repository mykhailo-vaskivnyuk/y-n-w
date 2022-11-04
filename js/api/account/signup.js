"use strict";
const crypto_1 = require("../../utils/crypto");
const types_1 = require("../types");
const signup = async ({ session, origin }, { email }) => {
    let [user] = await execQuery.user.findUserByEmail([email]);
    if (user)
        return null;
    const hashedPassword = await (0, crypto_1.createHash)('12345');
    const token = (0, crypto_1.createUnicCode)(15);
    await execQuery.user.createUser([email, hashedPassword, token]);
    [user] = await execQuery.user.findUserByEmail([email]);
    if (!user)
        throw new Error('Unknown error');
    const { user_id, link } = user;
    session.write('user_id', user_id);
    await mailService.sendMail.confirm(email, origin, token);
    return { ...user, confirmed: !link };
};
signup.paramsSchema = types_1.SignupParamsSchema;
signup.responseSchema = types_1.UserResponseSchema;
module.exports = signup;
//# sourceMappingURL=signup.js.map