import Joi from 'joi';
import { OutputValidationError } from '../errors';
import { TOutputModule } from '../types';
import { outputSchemaToSchema } from '../utils';

const options = {
  allowUnknown: true,
  stripUnknown: true,
  errors: { render: false },
};

const validateOutput: TOutputModule = () =>
  async (response, { ...context }, handler) => {
    const { responseSchema } = handler || {};
    if (!responseSchema) throw new Error('Handler is not put');
    const schema = outputSchemaToSchema(responseSchema);
    let result;
    if (Array.isArray(schema)) {
      result = Joi
        .alternatives()
        .match('any')
        .try(...schema)
        .validate(response, options);
    } else result = schema.validate(response, options);
    const { error, value } = result;
    if (error) {
      logger.error(error);
      throw new OutputValidationError(error.details);
    }
    return [value, context];
  };

export default validateOutput;
