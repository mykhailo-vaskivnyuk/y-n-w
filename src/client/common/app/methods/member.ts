/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import {
  NetViewKeys, IMemberInviteParams, IMemberResponse,
} from '../../api/types/types';
import { IClientAppThis } from '../types';
import { AppStatus } from '../../constants';
import { getMemberDataMethods } from './memberData';

export const getMemberMethods = (parent: IClientAppThis) => ({
  data: getMemberDataMethods(parent),

  async find(netView: NetViewKeys, nodeId: number) {
    const { [netView]: netViewData } = parent.getState();
    const memberPosition = netViewData
      .findIndex((item) => item.node_id === nodeId);
    const member = netViewData[memberPosition];
    parent.setMember(member);
    if (member) parent.setNetView(netView);
  },

  getName(
    netView: NetViewKeys, member: IMemberResponse, memberPosition: number,
  ) {
    const position = netView === 'tree' ?
      memberPosition + 1 :
      memberPosition && memberPosition + 1;
    const { name, member_name: memberName } = member;
    return name || memberName || `member ${position}`;
  },

  async inviteCreate(args: Pick<IMemberInviteParams, 'member_name'>) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const { net, netView, memberData } = parent.getState();
      const token = await parent.api.member.invite.create({
        ...args,
        member_node_id: memberData!.node_id,
        ...net!,
      });
      if (token) {
        await parent.netMethods.getTree();
        await this.find(netView!, memberData!.node_id);
      }
      parent.setStatus(AppStatus.READY);
      return token;
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async inviteCancel() {
    parent.setStatus(AppStatus.LOADING);
    try {
      const { net, netView, memberData } = parent.getState();
      const success = await parent.api.member.invite
        .cancel({ member_node_id: memberData!.node_id, ...net! });
      if (success) {
        await parent.netMethods.getTree();
        await this.find(netView!, memberData!.node_id);
      }
      parent.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async inviteConfirm() {
    parent.setStatus(AppStatus.LOADING);
    try {
      const { net, netView, memberData } = parent.getState();
      const success = await parent.api.member.invite
        .confirm({ member_node_id: memberData!.node_id, ...net! });
      if (success) {
        await parent.netMethods.getTree();
        await this.find(netView!, memberData!.node_id);
      }
      parent.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  },

  async inviteRefuse() {
    parent.setStatus(AppStatus.LOADING);
    try {
      const { net, netView, memberData } = parent.getState();
      const success = await parent.api.member.invite
        .refuse({ member_node_id: memberData!.node_id, ...net! });
      if (success) {
        await parent.netMethods.getTree();
        await this.find(netView!, memberData!.node_id);
      }
      parent.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  },
});
