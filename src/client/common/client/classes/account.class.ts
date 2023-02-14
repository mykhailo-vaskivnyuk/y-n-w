/* eslint-disable import/no-cycle */
import * as T from '../../server/types/types';
import { IClientAppThis, TLoginOrSignup } from '../types';
import { AppStatus } from '../constants';

type IApp = Pick<IClientAppThis,
  | 'api'
  | 'setStatus'
  | 'setError'
  | 'setUser'
  | 'emit'
>;

export class Account{
  private user: T.IUserResponse = null;

  constructor(private app: IApp) {}

  getUser() {
    return this.user;
  }
  
  private async setUser(user: T.IUserResponse) {
    if (this.user === user) return;
    this.user = user;
    await this.app.setUser(user);
  }

  setUserStatus(user_status: T.UserStatusKeys) {
    if (!this.user) return;
    this.user = { ...this.user, user_status}
    this.app.emit('user', this.user);
  }

  async readUser() {
    this.app.setStatus(AppStatus.LOADING);
    try {
      const user = await this.app.api!.user.read();
      await this.setUser(user);
      this.app.setStatus(AppStatus.READY);
      return user;
    } catch (e: any) {
      this.app.setError(e);
    }
  }

  async loginOrSignup(...[type, args]: TLoginOrSignup) {
    this.app.setStatus(AppStatus.LOADING);
    try {
      const user = await this.app.api.account[type](args as any);
      user && await this.setUser(user);
      this.app.setStatus(AppStatus.READY);
      return user;
    } catch (e: any) {
      this.app.setError(e);
      throw e;
    }
  }

  async logoutOrRemove(type: 'logout' | 'remove') {
    this.app.setStatus(AppStatus.LOADING);
    try {
      const success = await this.app.api.account[type]();
      success && await this.setUser(null);
      this.app.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      this.app.setError(e);
      throw e;
    }
  }

  async overmail(args: T.ISignupParams) {
    this.app.setStatus(AppStatus.LOADING);
    try {
      const success = await this.app.api.account.overmail(args);
      this.app.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      this.app.setError(e);
    }
  }

  async loginOverLink(
    type: 'confirm' | 'restore', args: T.ITokenParams,
  ): Promise<T.IUserResponse> {
    this.app.setStatus(AppStatus.LOADING);
    try {
      const user = await this.app.api.account[type](args);
      user && await this.setUser(user);
      this.app.setStatus(AppStatus.READY);
      return user;
    } catch (e: any) {
      this.app.setError(e);
      throw e;
    }
  }
}
