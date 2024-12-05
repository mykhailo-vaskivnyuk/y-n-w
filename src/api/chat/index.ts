import Joi from 'joi';
import { THandler } from '../../controller/types';
import {
  IChatSendMessage,
  IChatGetMessages,
  IChatGetMessagesResponse,
} from '../../client/common/server/types/types';
import {
  ChatGetMessagesResponseSchema,
  ChatGetMessagesSchema,
  ChatSendMessageSchema,
} from '../schema/chat.schema';

// error handle ?
// sendMessage return value ?

export const sendMessage: THandler<IChatSendMessage, boolean> = async (
  { session },
  messageData,
) => {
  const user_id = session.read('user_id')!;
  const [message, connectionIds] = chatService.persistMessage(
    user_id,
    messageData,
  );
  return connectionService.sendMessage(
    { type: 'CHAT', ...message },
    connectionIds,
  );
};
sendMessage.paramsSchema = ChatSendMessageSchema;
sendMessage.responseSchema = Joi.boolean();

export const getMessages: THandler<
  IChatGetMessages,
  IChatGetMessagesResponse
> = async ({ session }, params) => {
  const user_id = session.read('user_id')!;
  return chatService.getMessages(user_id, params);
};
getMessages.paramsSchema = ChatGetMessagesSchema;
getMessages.responseSchema = ChatGetMessagesResponseSchema;

export const removeConnection: THandler<never, boolean> = async ({
  connectionId,
}) => {
  chatService.removeConnection(connectionId);
  return true;
};
removeConnection.responseSchema = Joi.boolean();
removeConnection.allowedForUser = 'NOT_LOGGEDIN';
