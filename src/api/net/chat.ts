import Joi from 'joi';
import { THandler } from '../../router/types';
import { JOI_NULL } from '../../router/constants';

type INetChatSend = {
  node_id: number;
  chatId: number;
  message: string;
}

type INetChatResponse = {
  chatId: number;
  message: string;
} | null;

export const send: THandler<INetChatSend, INetChatResponse> =
  async ({ userNet, userNetStatus }, { node_id, chatId, message }) => {
    const { parent_node_id } = userNet!;
    if (userNetStatus !== 'INSIDE_NET') return null;
    if (chatId !== +(parent_node_id || 0) && chatId !== +node_id) return null;
    return { chatId, message };
  };
send.paramsSchema = {
  node_id: Joi.number().required(),
  chatId: Joi.number().required(),
  message: Joi.string().required(),
};
send.responseSchema = [JOI_NULL, {
  chatId: Joi.number().required(),
  message: Joi.string().required(),
}];
