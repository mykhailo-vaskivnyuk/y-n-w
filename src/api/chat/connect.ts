import { THandler } from '../../router/types';
import {
  IChatConnectNet, IChatResponseMessage,
} from '../../client/common/api/types/types';
import {
  ChatConnectNetSchema, ChatResponseMessageSchema,
} from '../schema/chat.schema';

export const net: THandler<IChatConnectNet, IChatResponseMessage> =
  async ({ session, userNet }, { netView }) => {
    const user_id = session.read('user_id')!;
    const chatId = chatService.getChatIdOfNet(userNet!, netView);
    if (!chatId) return null;
    return { chatId, user_id, index: 0 };
  };
net.paramsSchema = ChatConnectNetSchema;
net.responseSchema = ChatResponseMessageSchema;

export const user: THandler<never, IChatResponseMessage> =
  async ({ session }) => {
    const user_id = session.read('user_id')!;
    const chatId = chatService.getUserChatId(user_id);
    return { chatId, user_id, index: 0 };
  };
user.responseSchema = ChatResponseMessageSchema;
