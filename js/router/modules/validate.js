"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.ValidationError = void 0;
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
    const { schema } = handler || {};
    if (!schema)
        return [context, data];
    const { error, value } = schema.validate(data.params, options);
    if (!error) {
        Object.assign(data.params, { ...value });
        return [context, data];
    }
    logger.error(error);
    throw new ValidationError(error.details);
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map