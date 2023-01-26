/* eslint-disable import/no-cycle */
import { IUserChanges } from '@api/api/types/changes.types';
import { AppStatus } from '@api/constants';
import { IClientAppThis } from '../types';

export const getChangesMethods = (parent: IClientAppThis) => ({
  async read() {
    parent.setStatus(AppStatus.LOADING);
    try {
      const changes = await parent.api.user.changes.read();
      await this.update(changes);
      parent.setChanges(changes);
      parent.setStatus(AppStatus.READY);
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async update(changes: IUserChanges) {
    // status ?
    const { net } = parent.getState();
    const { node_id: nodeId, net_node_id: netNodeId } = net || {};
    let updateAll = false;
    let updateNet = false;
    for (const { user_node_id: userNodeId } of changes) {
      if (userNodeId) {
        if (userNodeId !== nodeId) continue;
        updateNet = true;
      } else {
        updateAll = true;
        break;
      }
    }
    if (updateAll) {
      // update all
      return;
    }
    if (!updateNet) return;
    await parent.net.enter(netNodeId!, false);
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
