"use strict";
const types_1 = require("../types");
const confirm = async ({ session }, { token }) => {
    const [user] = await execQuery.user.findByLink([token]);
    if (!user)
        return null;
    const { user_id, link } = user;
    await execQuery.user.unsetLink([user_id]);
    await session.write('user_id', user_id);
    return { ...user, confirmed: !link };
};
confirm.paramsSchema = types_1.ConfirmParamsSchema;
confirm.responseSchema = types_1.UserResponseSchema;
module.exports = confirm;
//# sourceMappingURL=confirm.js.map