/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import * as T from '../../server/types/types';
import { IClientAppThis, INetThis } from '../types';
import { AppStatus } from '../constants';

type IApp = IClientAppThis;
type INet = INetThis;

export class MemberActions {

  constructor(private app: IApp, private net: INet) {}

  getName(
    netView: T.NetViewEnum,
    member: T.IMemberResponse,
    memberPosition: number,
  ) {
    const position = netView === 'tree' ?
      memberPosition + 1 :
      memberPosition && memberPosition + 1;
    const { name, member_name: memberName } = member;
    return name || memberName || `Учасник ${position}`;
  }

  async setDislike(member_node_id: number) {
    try {
      await this.app.setStatus(AppStatus.LOADING);
      const { net } = this.app.getState();
      const success = await this.app.api.member.data.dislike
        .set({ ...net!, member_node_id });
      success && await this.net.onMemberChanged();
      this.app.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      this.app.setError(e);
    }
  }

  async unsetDislike(member_node_id: number) {
    try {
      await this.app.setStatus(AppStatus.LOADING);
      const { net } = this.app.getState();
      const success = await this.app.api.member.data.dislike
        .unSet({ ...net!, member_node_id });
      success && await this.net.onMemberChanged();
      this.app.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      this.app.setError(e);
    }
  }

  async setVote(member_node_id: number) {
    try {
      await this.app.setStatus(AppStatus.LOADING);
      const { net } = this.app.getState();
      const success = await this.app.api.member.data.vote
        .set({ ...net!, member_node_id });
      if (success) {
        await this.net.onMemberChanged();
        await this.net.onUserNetDataChanged();
      }
      this.app.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      this.app.setError(e);
    }
  }

  async unsetVote(member_node_id: number) {
    try {
      await this.app.setStatus(AppStatus.LOADING);
      const { net } = this.app.getState();
      const success = await this.app.api.member.data.vote
        .unSet({ ...net!, member_node_id });
      if (success) {
        if (member_node_id === net?.node_id)
          await this.net.onUserNetDataChanged();
        else await this.net.onMemberChanged();
      }
      this.app.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      this.app.setError(e);
    }
  }
}
