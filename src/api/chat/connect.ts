import Joi from 'joi';
import { THandler } from '../../router/types';
import * as T from '../../client/common/server/types/types';
import { ChatConnectAllSchema } from '../schema/chat.schema';

export const nets: THandler<never, T.IChatConnectAll> =
  async ({ session, connectionId }) => {
    if (!connectionId) return [];
    const user_id = session.read('user_id')!;
    const nets = await execQuery.user.nets.get([user_id!]);
    const allChatIds: T.IChatConnectAll = [];
    for (const net of nets) {
      allChatIds.push(
        chatService.getChatIdsOfNet(net, connectionId),
      );
    }
    return allChatIds;
  };
nets.responseSchema = ChatConnectAllSchema;

export const user: THandler<never, boolean> =
  async ({ session, connectionId }) => {
    const user_id = session.read('user_id')!;
    if (!connectionId) return false;
    chatService.getChatIdOfUser(user_id, connectionId)!;
    return true;
  };
user.responseSchema = Joi.boolean();
