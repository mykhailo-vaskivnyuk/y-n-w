"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const joi_1 = __importDefault(require("joi"));
const remove = async (context) => {
    const user_id = await context.session.read('user_id');
    if (!user_id)
        return false;
    await context.session.clear();
    await execQuery.user.remove([user_id]);
    return true;
};
remove.responseSchema = joi_1.default.boolean();
module.exports = remove;
//# sourceMappingURL=remove.js.map