import Joi from 'joi';
import { THandler } from '../../router/types';
import {
  IChatSendMessage, IChatGetMessages, IChatGetMessagesResponse,
} from '../../client/common/server/types/types';
import {
  ChatGetMessagesResponseSchema, ChatGetMessagesSchema,
  ChatSendMessageSchema,
} from '../schema/chat.schema';
import { chatIdVerified } from '../utils/chat.utils';

export const sendMessage: THandler<IChatSendMessage, boolean> =
  async ({ session, userNet }, messageData) => {
    if (!chatIdVerified(userNet!, messageData)) return false;
    const user_id = session.read('user_id');
    const [message, connectionIds] =
      chatService.persistMessage(user_id!, messageData);
    return connectionService.sendMessage(message, connectionIds);
  };
sendMessage.paramsSchema = ChatSendMessageSchema;
sendMessage.responseSchema = Joi.boolean();

export const getMessages: THandler<
  IChatGetMessages, IChatGetMessagesResponse
> = async ({ userNet }, params) => {
  if (!chatIdVerified(userNet!, params)) return [];
  return chatService.getMessages(params);
};
getMessages.paramsSchema = ChatGetMessagesSchema;
getMessages.responseSchema = ChatGetMessagesResponseSchema;

export const removeConnection: THandler<never, boolean> =
  async ({ connectionId }) => chatService.removeConnection(connectionId!);
removeConnection.responseSchema = Joi.boolean();
