/* eslint-disable import/no-cycle */
import* as T from '../../api/types/types';
import { IClientAppThis } from '../types';
import { AppStatus } from '../../constants';

export const getChatMethods = (parent: IClientAppThis) => ({
  async connectAll() {
    parent.setStatus(AppStatus.LOADING);
    try {
      const { allNets } = parent.getState();
      let promisies: Promise<any>[] = [];

      for (const {
        net_node_id: netNodeId,
        node_id: nodeId,
        parent_node_id: parentNodeId,
        } of allNets
      ) {
        promisies = promisies
          .concat(this.getPromisies(nodeId, -netNodeId))
          .concat(this.getPromisies(nodeId, -nodeId))
          .concat(parentNodeId ? this.getPromisies(nodeId, parentNodeId) : []); 
      }

      await Promise.all(promisies);
      parent.setStatus(AppStatus.READY);
    } catch (e: any) {
      parent.setError(e);
    }
  },

  getPromisies(nodeId: number, chatId: number) {
    const req = { node_id: nodeId, chatId };
    return [
      parent.api.chat.sendMessage(req),
      parent.api.chat.getMessages(req).then(
        (messages) => parent.setAllMessages(chatId, messages),
      ),
    ];
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

  getChatId(netView?: T.NetViewKeys) {
    const { net } = parent.getState();
    const {
      net_node_id: netNodeId,
      node_id: nodeId,
      parent_node_id: parentNodeId,
    } = net!;
    if (!netView) return -netNodeId;
    if (netView === 'tree') return nodeId;
    if (parentNodeId) return parentNodeId;
  }
});
