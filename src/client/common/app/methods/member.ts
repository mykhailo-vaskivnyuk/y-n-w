/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import {
  NetViewKeys, IMemberInviteParams,
  MemberStatusKeys, IMemberResponse,
} from '../../api/types/types';
import { IClientAppThis } from '../types';
import { AppStatus } from '../../constants';

export const getMemberMethods = (parent: IClientAppThis) => ({
  async find(netView: NetViewKeys, nodeId: number) {
    const { [netView]: netViewData } = parent.getState();
    const memberPosition = netViewData
      .findIndex((item) => item.node_id === nodeId);
    const member = netViewData[memberPosition];
    parent.setMember(member);
    if (member) parent.setNetView(netView);
  },

  getStatus(member?: IMemberResponse) {
    let memberStatus: MemberStatusKeys = 'UNAVAILABLE';
    if (!member) return memberStatus;
    memberStatus = 'EMPTY';
    const { name, token } = member;
    if (name) {
      if (token) memberStatus = 'CONNECTED';
      else memberStatus = 'ACTIVE';
    } else if (token) memberStatus = 'INVITED';
    return memberStatus;
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
        ...net!,
        ...memberData!,
        ...args,
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
        .cancel({ ...net!, ...memberData! });
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
        .confirm({ ...net!, ...memberData! });
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
        .refuse({ ...net!, ...memberData! });
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
