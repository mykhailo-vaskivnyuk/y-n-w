"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationResponseError = void 0;
const joi_1 = __importDefault(require("joi"));
const utils_1 = require("../utils");
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
const responseSchemaToSchema = (schema) => {
    if (Array.isArray(schema)) {
        return schema.map((item) => responseSchemaToSchema(item));
    }
    return (0, utils_1.isJoiSchema)(schema) ? schema : joi_1.default.object(schema);
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
        logger.error(error, error.message);
        throw new ValidationResponseError(error.details);
    }
    return [value, context];
};
exports.default = validateResponse;
//# sourceMappingURL=validate.response.js.map