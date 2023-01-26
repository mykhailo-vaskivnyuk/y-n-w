/* eslint-disable import/no-cycle */
import * as T from '../../api/types/types';
import { IClientAppThis } from '../types';
import { AppStatus } from '../../constants';

export const getChatMethods = (parent: IClientAppThis) => ({
  async connectAll() {
    const userChatId = await parent.api.chat.connect.user();
    parent.setUserChatId(userChatId);
    const allChatIds = await parent.api.chat.connect.nets();
    const netChatIdsMap = new Map<number, T.INetChatIds>();
    for (const chatIds of allChatIds) {
      const { net_node_id: netNodeId, ...netChatIds } = chatIds;
      netChatIdsMap.set(netNodeId, netChatIds);
    }
    parent.setNetChatIds(netChatIdsMap);
  },

  async getMessages(chatId: number, index = 1) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const { node_id: nodeId } = parent.getState().net!;
      const messages = await parent.api.chat
        .getMessages({ node_id: nodeId, chatId, index });
      parent.setAllMessages(chatId, messages);
      parent.setStatus(AppStatus.READY);
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async sendMessage(message: string, chatId: number) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const { net } = parent.getState();
      const { node_id: nodeId } = net!;
      chatId && await parent.api.chat
        .sendMessage({ node_id: nodeId, chatId, message });
      parent.setStatus(AppStatus.READY);
      return true;
    } catch (e: any) {
      parent.setError(e);
    }
  },

  getChatId(netView: T.NetViewKeys) {
    const { net, chatIds } = parent.getState();
    return chatIds.get(net!.net_node_id)?.[netView];
  },
});
