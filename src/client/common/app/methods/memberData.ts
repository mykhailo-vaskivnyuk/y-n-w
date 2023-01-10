/* eslint-disable import/no-cycle */
import { IClientAppThis } from '../types';
import { AppStatus } from '../../constants';

export const getMemberDataMethods = (parent: IClientAppThis) => ({
  async setDislike(nodeId: number) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const { net, netView } = parent.getState();
      const success = await parent.api.member.data.dislike
        .set({ ...net!, member_node_id: nodeId });
      if (success) {
        netView === 'tree' && await parent.netMethods.getTree();
        netView === 'circle' && await parent.netMethods.getCircle();
      }
      parent.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async unsetDislike(nodeId: number) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const { net, netView } = parent.getState();
      const success = await parent.api.member.data.dislike
        .unSet({ ...net!, member_node_id: nodeId });
      if (success) {
        netView === 'tree' && await parent.netMethods.getTree();
        netView === 'circle' && await parent.netMethods.getCircle();
      }
      parent.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async setVote(nodeId: number) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const { net } = parent.getState();
      const success = await parent.api.member.data.vote
        .set({ ...net!, member_node_id: nodeId });
      if (success) {
        await parent.netMethods.getUserData(net!.net_node_id);
        await parent.netMethods.getCircle();
      }
      parent.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async unsetVote(nodeId: number) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const { net } = parent.getState();
      const success = await parent.api.member.data.vote
        .unSet({ ...net!, member_node_id: nodeId });
      if (success) {
        await parent.netMethods.getUserData(net!.net_node_id);
        await parent.netMethods.getCircle();
      }
      parent.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
    }
  },
});
