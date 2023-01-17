import { THandler } from '../../router/types';
import {
  IChatGetMessages, IChatGetMessagesResponse,
  IChatResponseMessage, IChatSendMessage,
} from '../../client/common/api/types/types';
import {
  ChatGetMessagesResponseSchema, ChatGetMessagesSchema,
  ChatResponseMessageSchema, ChatSendMessageSchema,
} from '../schema/chat.schema';
import { chatIdVerified } from '../utils/chat.utils';

export const sendMessage: THandler<
  IChatSendMessage, IChatResponseMessage
> = async ({ session, userNet }, message) => {
  if (!chatIdVerified(userNet!, message)) return null;
  const user_id = session.read('user_id');
  return chatService.addMessage(user_id!, message);
};
sendMessage.paramsSchema = ChatSendMessageSchema;
sendMessage.responseSchema = ChatResponseMessageSchema;

export const getMessages: THandler<
  IChatGetMessages, IChatGetMessagesResponse
> = async ({ userNet }, message) => {
  if (!chatIdVerified(userNet!, message)) return [];
  return chatService.getMessages(message);
};
getMessages.paramsSchema = ChatGetMessagesSchema;
getMessages.responseSchema = ChatGetMessagesResponseSchema;
