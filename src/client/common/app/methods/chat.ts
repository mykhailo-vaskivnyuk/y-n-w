/* eslint-disable import/no-cycle */
import * as T from '../../api/types/types';
import { IClientAppThis } from '../types';
import { AppStatus } from '../../constants';

export const getChatMethods = (parent: IClientAppThis) => ({
  connectAll() {
    const { allNets } = parent.getState();
    let promisies: Promise<any>[] = [];
    for (const { node_id: nodeId } of allNets)
      promisies = promisies.concat(this.getPromisies(nodeId));
    promisies.push(parent.api.chat.connect.user())
    Promise.all(promisies);
  },

  getPromisies(nodeId: number) {
    const getMessages = async (chatId?: number) => chatId && parent.api.chat
      .getMessages({ chatId, node_id: nodeId })
      .then((messages) => parent.setAllMessages(chatId, messages));
    const getChatIdAndMessages = async (netView: T.NetViewKeys) =>
      parent.api.chat.connect.net({ node_id: nodeId, netView })
        .then((message) => parent.setChatId(nodeId, netView, message))
        .then(getMessages);
    return T.NET_VIEW_MAP.map(getChatIdAndMessages);
  },

  async getMessages(chatId: number, index = 1 ) {
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
    return chatIds.get(net!.node_id)?.[netView];
  },
});
