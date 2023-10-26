import Joi from 'joi';
import {
  IChatGetMessages, IChatMessage, OmitNull,
  IChatResponseMessage, IChatSendMessage, NET_VIEW_MAP,
} from '../../client/common/server/types/types';
import { TJoiSchema } from '../../controller/types';
import { JOI_NULL } from '../../controller/constants';

const ChatMessageSchema = {
  chatId: Joi.number().required(),
  message: Joi.string(),
};

export const ChatConnectSchema = {
  node_id: Joi.number().required(),
  netView: Joi.string().custom((value, helpers) => {
    if (NET_VIEW_MAP.includes(value)) return value;
    return helpers.error('invalid net_view');
  }),
};

export const ChatSendMessageSchema = {
  ...ChatMessageSchema,
  node_id: Joi.number().required(),
} as Record<keyof IChatSendMessage, TJoiSchema>;

export const ChatResponseMessageSchema = [JOI_NULL, {
  ...ChatMessageSchema,
  user_id: Joi.number(),
  index: Joi.number(),
} as Record<keyof OmitNull<IChatResponseMessage>, TJoiSchema>];

export const ChatGetMessagesSchema = {
  node_id: Joi.number().required(),
  chatId: Joi.number().required(),
  index: Joi.number(),
} as Record<keyof IChatGetMessages, TJoiSchema>;

export const ChatGetMessagesResponseSchema = {
  user_id: Joi.number(),
  index: Joi.number(),
  message: Joi.string(),
} as Record<keyof IChatMessage, TJoiSchema>;

export const ChatConnectAllSchema = {
  net_id: Joi.number(),
  net: Joi.number(),
  tree: Joi.number(),
  circle: Joi.number(),
};
