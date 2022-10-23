"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const joi_1 = __importDefault(require("joi"));
const login = async (context, { email, password }) => {
    const [user = null] = await execQuery.auth.getUserIfExists([email, password]);
    return user;
};
exports.login = login;
login.params = {
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
};
//# sourceMappingURL=auth.js.map