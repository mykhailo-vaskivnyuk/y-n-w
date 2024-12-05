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
  async function validateOutput(response, context, handler): Promise<any> {
    if (Array.isArray(response)) {
      const value = [];
      for (const item of response) {
        const itemValue = await validateOutput(item, context, handler);
        value.push(itemValue);
      }
      return value;
    }

    const { responseSchema } = handler || {};
    if (!responseSchema) throw new Error('Response schema is not define');
    const isAny = Object.keys(responseSchema).length === 0;
    if (isAny) return response;
    const schema = outputSchemaToSchema(responseSchema);
    let result;
    if (Array.isArray(schema)) {
      result = Joi.alternatives()
        .match('any')
        .try(...schema)
        .validate(response, options);
    } else result = schema.validate(response, options);
    const { error, value } = result;
    if (error) {
      logger.error(error);
      throw new OutputValidationError(error.details);
    }
    return value;
  };

export default validateOutput;
