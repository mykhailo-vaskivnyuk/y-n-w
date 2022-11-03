"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJoiSchema = exports.ValidationResponseError = void 0;
const joi_1 = __importDefault(require("joi"));
class ValidationResponseError extends Error {
    details;
    constructor(details) {
        super('Validation response error');
        this.name = this.constructor.name;
        this.details = details;
    }
}
exports.ValidationResponseError = ValidationResponseError;
const options = {
    allowUnknown: true,
    stripUnknown: true,
    errors: { render: false },
};
const isJoiSchema = (schema) => {
    return joi_1.default.isSchema(schema);
};
exports.isJoiSchema = isJoiSchema;
const responseSchemaToSchema = (schema) => {
    if (Array.isArray(schema)) {
        return schema.map((item) => responseSchemaToSchema(item));
    }
    return (0, exports.isJoiSchema)(schema) ? schema : joi_1.default.object(schema);
};
const validateResponse = () => async (response, context, handler) => {
    const { responseSchema } = handler || {};
    if (!responseSchema)
        throw new Error('Handler is not put');
    const schema = responseSchemaToSchema(responseSchema);
    let result;
    if (Array.isArray(schema)) {
        result = joi_1.default.alternatives().match('any').try(...schema).validate(response, options);
    }
    else
        result = schema.validate(response, options);
    const { error, value } = result;
    if (error) {
        logger.error(error);
        throw new ValidationResponseError(error.details);
    }
    return [value, context];
};
exports.default = validateResponse;
//# sourceMappingURL=validate.response.js.map