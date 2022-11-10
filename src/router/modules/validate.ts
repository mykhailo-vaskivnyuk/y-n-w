import Joi, { ValidationErrorItem } from 'joi';
import { TModule } from '../types';

export class ValidationError extends Error {
  public details: Record<string, unknown>[];
  constructor(details: ValidationErrorItem[]) {
    super('Validation error');
    this.name = this.constructor.name;
    this.details = details as unknown as Record<string, unknown>[];
  }
}

const options = {
  allowUnknown: true,
  stripUnknown: true,
  errors: { render: false },
};

const validate: TModule = () => async (operation, context, handler) => {
  const { schema, paramsSchema } = handler || {};
  if (!paramsSchema) return [operation, context];
  if (!schema) handler!.schema = Joi.object(paramsSchema);
  const { data } = operation;
  const { error, value } = handler!.schema!.validate(data.params, options);
  if (error) {
    logger.error(error);
    throw new ValidationError(error.details);
  }
  Object.assign(data.params, { ...value });
  return [operation, context];
};

export default validate;
