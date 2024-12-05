/* eslint-disable indent */
import Joi from 'joi';
import { TInputModule } from '../types';
import { InputValidationError } from '../errors';

const options = {
  allowUnknown: true,
  stripUnknown: true,
  errors: { render: false },
};

const validateInput: TInputModule =
  () =>
  async ({ ...operation }, context, handler) => {
    const { schema, paramsSchema } = handler || {};
    if (!paramsSchema) return operation;
    const isAny = Object.keys(paramsSchema).length === 0;
    if (isAny) return operation;
    if (!schema) handler!.schema = Joi.object(paramsSchema);
    const { data } = operation;
    const { error, value } = handler!.schema!.validate(data.params, options);
    if (error) {
      logger.error(error);
      throw new InputValidationError(error.details);
    }
    data.params = value;
    return operation;
  };

export default validateInput;
