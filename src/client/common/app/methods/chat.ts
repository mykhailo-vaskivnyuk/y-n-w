/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import { IChatResponseMessage, NetViewKeys } from '../../api/types/types';
import { IClientAppThis } from '../types';
import { AppStatus } from '../../constants';

export const getChatMethods = (parent: IClientAppThis) => ({
  async connectAll() {

    console.log('CONNECT ALL');

    parent.setStatus(AppStatus.LOADING);
    const { allNets } = parent.getState();
    const promosies = [];

    for (const net of allNets) {
      const {
        net_node_id: netNodeId,
        node_id: nodeId,
        parent_node_id: parentNodeId,
      } = net;
      const req = { node_id: nodeId };

      promosies.push(parent.api.chat
          .sendMessage({ ...req, chatId: -netNodeId }));
      promosies.push(parent.api.chat
        .getMessages({ ...req, chatId: -netNodeId })
        .then((messages) => parent.setAllMessages(-netNodeId, messages))
      );

      promosies.push(parent.api.chat.sendMessage({ ...req, chatId: nodeId }));
      promosies.push(parent.api.chat
        .getMessages({ ...req, chatId: nodeId })
        .then((messages) => parent.setAllMessages(nodeId, messages))
      );

      if (!parentNodeId) continue;
      
      promosies.push(parent.api.chat
          .sendMessage({ ...req, chatId: parentNodeId }));
      promosies.push(parent.api.chat
        .getMessages({ ...req, chatId: parentNodeId })
        .then((messages) => parent.setAllMessages(parentNodeId, messages))
      );
    }
    try {
      await Promise.all(promosies);
      parent.setStatus(AppStatus.READY);
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async getMessages(chatId: number, index = 0 ) {
    console.log('GET MESSAGES')
    const { node_id: nodeId } = parent.getState().net!;
    parent.setStatus(AppStatus.LOADING);
    try {
      const messages = await parent.api.chat
        .getMessages({ node_id: nodeId, chatId, index });
      parent.setAllMessages(chatId, messages);
      parent.setStatus(AppStatus.READY);
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async sendMessage(message: string, netView?: NetViewKeys) {
    console.log('SEND MESSAGE', netView);
    parent.setStatus(AppStatus.LOADING);
    try {
      const { net } = parent.getState();
      const {
        net_node_id: netNodeId,
        node_id: nodeId,
        parent_node_id: parentNodeId } = net!;
      if (!netView) {
        await parent.api.chat
          .sendMessage({ node_id: nodeId, chatId: -netNodeId, message });
      } else if (netView === 'tree') {
        await parent.api.chat
          .sendMessage({ node_id: nodeId, chatId: nodeId, message });
      } else if (parentNodeId) {
        await parent.api.chat
          .sendMessage({ node_id: nodeId, chatId: parentNodeId, message });
      }
      parent.setStatus(AppStatus.READY);
      return true;
    } catch (e: any) {
      parent.setError(e);
    }
  },

  onMessage(message: IChatResponseMessage) {
    if (!message) return;
    // console.log('ON MESSAGE', message)
    parent.setMessage(message);
  }
});
