"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.ValidationError = void 0;
const joi_1 = __importDefault(require("joi"));
class ValidationError extends Error {
    details;
    constructor(details) {
        super('Validation error');
        this.name = this.constructor.name;
        this.details = details;
    }
}
exports.ValidationError = ValidationError;
const options = {
    allowUnknown: true,
    stripUnknown: true,
    errors: { render: false },
};
const validate = () => async (context, data, handler) => {
    const { schema, params } = handler || {};
    if (!params)
        return [context, data];
    if (!schema)
        handler.schema = joi_1.default.object(params);
    const { error, value } = handler.schema.validate(data.params, options);
    if (error) {
        logger.error(error);
        throw new ValidationError(error.details);
    }
    Object.assign(data.params, { ...value });
    return [context, data];
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map