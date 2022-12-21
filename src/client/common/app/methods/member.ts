/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import { NetViewKeys } from '../../api/types/net.types';
import { IMemberInviteParams } from '../../api/types/member.types';
import { TMemberInviteCancel } from '../../api/types/client.api.types';
import { IClientAppThis } from '../types';
import { AppStatus } from '../../constants';

export const getMemberMethods = (parent: IClientAppThis) => ({
  async find(netView: NetViewKeys, nodeId: number) {
    const { [netView]: netViewData } = parent.getState();
    parent.setNetView(netView);
    const memberPosition = netViewData
      .findIndex((item) => item.node_id === Number(nodeId));
    parent.setMemberPosition(memberPosition > -1 ? memberPosition : undefined);
  },

  async inviteCreate(args: IMemberInviteParams) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const token = await parent.api.member.invite.create(args);
      if (token) await parent.netMethods.getTree();
      parent.setStatus(AppStatus.READY);
      return token;
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async inviteCancel(args: TMemberInviteCancel) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const success = await parent.api.member.invite.cancel(args);
      if (success) await parent.netMethods.getTree();
      parent.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
    }
  },
});
