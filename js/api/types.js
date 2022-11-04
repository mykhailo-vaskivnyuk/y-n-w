"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmParamsSchema = exports.SignupParamsSchema = exports.UserResponseSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.UserResponseSchema = [
    joi_1.default.any().equal(null),
    {
        email: joi_1.default.string(),
        name: [joi_1.default.string(), joi_1.default.any().equal(null)],
        mobile: [joi_1.default.string(), joi_1.default.any().equal(null)],
        net_name: [joi_1.default.string(), joi_1.default.any().equal(null)],
        confirmed: joi_1.default.boolean(),
    },
];
exports.SignupParamsSchema = {
    email: joi_1.default.string().required().email(),
};
exports.ConfirmParamsSchema = {
    token: joi_1.default.string(),
};
//# sourceMappingURL=types.js.map