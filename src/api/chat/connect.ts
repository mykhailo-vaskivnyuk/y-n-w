import { THandler } from '../../router/types';
import {
  IChatConnect, IChatConnectResponse,
} from '../../client/common/api/types/types';
import {
  ChatConnectSchema, ChatConnectResponseSchema,
} from '../schema/chat.schema';

export const net: THandler<IChatConnect, IChatConnectResponse> =
  async ({ connectionId, userNet }, { netView }) => {
    if (!connectionId) return null;
    const chatId = chatService.getChatIdOfNet(userNet!, netView, connectionId);
    if (!chatId) return null;
    return { chatId };
  };
net.paramsSchema = ChatConnectSchema;
net.responseSchema = ChatConnectResponseSchema;

export const user: THandler<never, IChatConnectResponse> =
  async ({ session, connectionId }) => {
    const user_id = session.read('user_id')!;
    if (!connectionId) return null;
    const chatId = chatService.getChatIdOfUser(user_id, connectionId);
    return { chatId };
  };
user.responseSchema = ChatConnectResponseSchema;
