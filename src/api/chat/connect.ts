import Joi from 'joi';
import { THandler } from '../../controller/types';
import * as T from '../../client/common/server/types/types';
import { ChatConnectAllSchema } from '../schema/chat.schema';

export const nets: THandler<never, T.IChatConnectAll> =
  async ({ session, connectionId }) => {
    if (!connectionId) return [];
    const user_id = session.read('user_id')!;
    const nets = await execQuery.user.nets.get([user_id!]);
    const allChatIds: T.IChatConnectAll = [];
    for (const node of nets) {
      const chats = chatService.getChatsForNet(user_id, node, connectionId);
      allChatIds.push(chats);
    }
    return allChatIds;
  };
nets.responseSchema = ChatConnectAllSchema;

export const user: THandler<never, boolean> =
  async ({ session, connectionId }) => {
    const user_id = session.read('user_id')!;
    if (!connectionId) return false;
    chatService.addUserConnection(user_id, connectionId);
    return true;
  };
user.responseSchema = Joi.boolean();
