import Joi from 'joi';

export const NetBoardReadResponseSchema = {
  message_id: Joi.number(),
  net_node_id: Joi.number(),
  user_id: Joi.number(),
  node_id: Joi.number(),
  net_view: Joi.string(),
  message: Joi.string(),
  date: Joi.date(),
};

export const BoardRemoveParamsSchema = {
  node_id: Joi.number(),
  message_id: Joi.number(),
};

export const BoardSaveParamsSchema = {
  node_id: Joi.number(),
  message_id: Joi.number(),
  message: Joi.string(),
};
