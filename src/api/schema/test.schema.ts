import Joi from 'joi';

export const TestResponseSchema = {
  field21: Joi.boolean().required(),
  field22: Joi.string(),
};
