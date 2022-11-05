"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJoiSchema = exports.isHandler = void 0;
const joi_1 = __importDefault(require("joi"));
const isHandler = (handler) => typeof handler === 'function';
exports.isHandler = isHandler;
const isJoiSchema = (schema) => joi_1.default.isSchema(schema);
exports.isJoiSchema = isJoiSchema;
//# sourceMappingURL=utils.js.map