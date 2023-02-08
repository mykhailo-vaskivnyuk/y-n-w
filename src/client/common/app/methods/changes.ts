/* eslint-disable import/no-cycle */
import {
  IChatResponseMessage, IInstantChange, IUserChanges,
} from '../../api/types/types';
import { IClientAppThis } from '../types';
import { OmitNull } from '../../types';
import { AppStatus } from '../../constants';

export const getChangesMethods = (parent: IClientAppThis) => ({
  lastDate: undefined as string | undefined,

  setLastDate(changes: IUserChanges) {
    this.lastDate = changes.at(-1)?.date;
  },

  isInstantChange(
    messageData: OmitNull<IChatResponseMessage> | IInstantChange,
  ): messageData is IInstantChange {
    return 'message_id' in messageData;
  },

  async read(inChain = false) {
    !inChain && parent.setStatus(AppStatus.LOADING);
    try {
      const newChanges = await parent.api
        .user.changes.read({ date: this.lastDate });
      this.setLastDate(newChanges);
      !inChain && await this.update(newChanges);
      if (newChanges.length) {
        const { changes: curChanges } = parent.getState();
        parent.setChanges([...curChanges, ...newChanges]);
      }
      !inChain && parent.setStatus(AppStatus.READY);
    } catch (e: any) {
      if (inChain) throw e;
      parent.setError(e);
    }
  },

  async update(changes: IUserChanges | IInstantChange[]) {
    const { user, net } = parent.getState();
    const { node_id: nodeId, net_id: netId } = net || {};
    let updateAll = false;
    let updateNet = false;
    for (const change of changes) {
      const { user_node_id: userNodeId, net_view: netView } = change;
      if (netView === 'net') {
        updateAll = true;
        if (userNodeId !== undefined && netId) updateNet = true;
        break;
      }
      if (userNodeId === nodeId) updateNet = true;
    }
    if (updateAll) await parent.setUser({ ...user! }, false)
      .catch(console.log);
    if (updateNet) await parent.net.enter(netId!, true)
      .catch(console.log);
  },

  async confirm(messageId: number) {
    parent.setStatus(AppStatus.LOADING);
    try {
      await parent.api.user.changes
        .confirm({ message_id: messageId });
      parent.setStatus(AppStatus.READY);
    } catch (e: any) {
      parent.setError(e);
    }
  },

  remove(messageId: number) {
    let { changes } = parent.getState();
    changes = changes.filter(({ message_id: v }) => messageId !== v);
    parent.setChanges(changes);
  },

});
