/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import * as T from '../../server/types/types';
import { IClientAppThis, IMember, INetThis } from '../types';
import { AppStatus } from '../constants';

type IApp = IClientAppThis;
type INet = INetThis;

export class Member {

  constructor(
    private member: IMember,
    private app: IApp,
    private net: INet,
  ) {}

  getMember() {
    return this.member;
  }

  async inviteCreate(args: Pick<T.IMemberInviteParams, 'member_name'>) {
    await this.app.setStatus(AppStatus.LOADING);
    try {
      const { net } = this.app.getState();
      const token = await this.app.api.member.invite.create({
        ...args,
        member_node_id: this.member.node_id,
        ...net!,
      });
      if (token) await this.net.onMemberChanged();
      this.app.setStatus(AppStatus.READY);
      return token;
    } catch (e: any) {
      this.app.setError(e);
    }
  }

  async inviteCancel() {
    await this.app.setStatus(AppStatus.LOADING);
    try {
      const { net } = this.app.getState();
      const success = await this.app.api.member.invite
        .cancel({ member_node_id: this.member.node_id, ...net! });
      if (success) await this.net.onMemberChanged();
      this.app.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      this.app.setError(e);
    }
  }

  async inviteConfirm() {
    await this.app.setStatus(AppStatus.LOADING);
    try {
      const { net } = this.app.getState();
      const success = await this.app.api.member.invite
        .confirm({ member_node_id: this.member.node_id, ...net! });
      if (success) await this.net.onMemberChanged();
      this.net.onNetChanged();
      this.app.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      this.app.setError(e);
      throw e;
    }
  }

  async inviteRefuse() {
    await this.app.setStatus(AppStatus.LOADING);
    try {
      const { net } = this.app.getState();
      const success = await this.app.api.member.invite
        .refuse({ member_node_id: this.member.node_id, ...net! });
      if (success) await this.net.onMemberChanged();
      this.app.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      this.app.setError(e);
      throw e;
    }
  }
}
