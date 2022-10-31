"use strict";
const types_1 = require("../types");
const usersRead = async (context) => {
    const { session } = context;
    const user_id = session.read('user_id');
    if (!user_id)
        return null;
    const [user] = await execQuery.user.getUserById([user_id]);
    if (!user)
        return null;
    return { ...user, confirmed: !user.link };
};
usersRead.responseSchema = types_1.UserResponseSchema;
module.exports = usersRead;
//# sourceMappingURL=read.js.map