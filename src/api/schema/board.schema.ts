import Joi from 'joi';

export const NetBoardReadResponseSchema = {
  message_id: Joi.number(),
  net_id: Joi.number(),
  user_id: Joi.number(),
  message: Joi.string(),
  date: Joi.date(),
};

export const BoardRemoveParamsSchema = {
  node_id: Joi.number().required(),
  message_id: Joi.number().required(),
};

export const BoardSaveParamsSchema = {
  node_id: Joi.number().required(),
  message_id: Joi.number(),
  message: Joi.string().required(),
};
