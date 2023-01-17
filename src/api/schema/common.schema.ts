import Joi from 'joi';

export const TokenParamsSchema = {
  token: Joi.string().required(),
};
