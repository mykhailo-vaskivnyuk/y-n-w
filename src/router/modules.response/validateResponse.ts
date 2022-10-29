import Joi, { ValidationErrorItem } from 'joi';
import { JoiSchema, THandler, TResponseModule } from '../types';

export class ValidationResponseError extends Error {
  public details: Record<string, unknown>[];
  constructor(details: ValidationErrorItem[]) {
    super('Validation response error');
    this.name = this.constructor.name;
    this.details = details as unknown as Record<string, unknown>[];
  }
}

const options = {
  allowUnknown: true,
  stripUnknown: true,
  errors: { render: false },
};

export const isJoiSchema = (schema: THandler['responseSchema']): schema is Joi.Schema => {
  return Joi.isSchema(schema);
}

const responseSchemaToSchema = (schema: THandler['responseSchema']): JoiSchema => {
  if (Array.isArray(schema)) {
    return schema.map((item) => responseSchemaToSchema(item) as Joi.Schema);
  }
  return isJoiSchema(schema) ? schema : Joi.object(schema);
};

export const validateResponse: TResponseModule = () => async (context, response, handler) => {
  const { responseSchema } = handler || {};
  if (!responseSchema) throw new Error('Handler is not put');
  const schema = responseSchemaToSchema(responseSchema);
  let result;
  if (Array.isArray(schema)) {
    result = Joi.alternatives().match('any').try(...schema).validate(response, options);
  }
  else result = schema.validate(response, options);
  const { error, value } = result;
  if (error) {
    logger.error(error);
    throw new ValidationResponseError(error.details);
  }
  return [context, value];
};
