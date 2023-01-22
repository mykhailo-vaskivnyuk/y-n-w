import { THandler } from '../../router/types';
import {
  IChatSendMessage, IChatGetMessages,
  IChatResponseMessage, IChatGetMessagesResponse,
} from '../../client/common/api/types/types';
import { JOI_NULL } from '../../router/constants';
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

export const remove: THandler<{ chatsToDelete: number[] }, null> =
  async ({ isAdmin }, { chatsToDelete }) => {
    if (!isAdmin) return null;
    for (const chatId of chatsToDelete) {
      chatService.remove(chatId);
    }
    return null;
  };
remove.responseSchema = JOI_NULL;
remove.allowedForUser = 'NOT_LOGGEDIN';
