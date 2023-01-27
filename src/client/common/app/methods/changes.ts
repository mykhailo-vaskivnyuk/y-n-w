/* eslint-disable import/no-cycle */
import { IUserChanges } from '@api/api/types/changes.types';
import { AppStatus } from '@api/constants';
import { IClientAppThis } from '../types';

export const getChangesMethods = (parent: IClientAppThis) => ({
  async read(inChain = false) {
    !inChain && parent.setStatus(AppStatus.LOADING);
    try {
      const changes = await parent.api.user.changes.read();
      !inChain && await this.update(changes);
      parent.setChanges(changes);
      !inChain && parent.setStatus(AppStatus.READY);
    } catch (e: any) {
      if (inChain) throw e;
      parent.setError(e);
    }
  },

  async update(changes: IUserChanges) {
    const { user, net } = parent.getState();
    const { node_id: nodeId, net_node_id: netNodeId } = net || {};
    let updateAll = false;
    let updateNet = false;
    for (const change of changes) {
      const { user_node_id: userNodeId } = change;
      if (!userNodeId) {
        updateAll = true;
        break;
      }
      if (userNodeId === nodeId) updateNet = true;
    }
    if (updateAll) return parent.setUser({ ...user! });
    if (updateNet) return parent.net.enter(netNodeId!, false);
  },

  async confirm(messageId: number) {
    parent.setStatus(AppStatus.LOADING);
    try {
      await parent.api.user.changes
        .confirm({ message_id: messageId });
      let { changes } = parent.getState();
      changes = changes
        .filter(({ message_id: v }) => messageId !== v);
      parent.setChanges(changes);
      parent.setStatus(AppStatus.READY);
    } catch (e: any) {
      parent.setError(e);
    }
  },

});
