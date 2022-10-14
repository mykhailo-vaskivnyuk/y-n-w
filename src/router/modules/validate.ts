import { ValidationErrorItem } from 'joi';
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

export const validate: TModule = () => async (context, data, handler) => {
  const { schema } = handler || {};
  if (!schema) return [context, data];
  const { error, value } = schema.validate(data.params, options);
  if (!error) {
    Object.assign(data.params, { ...value });
    return [context, data];
  }
  logger.error(error);
  throw new ValidationError(error.details);
}
