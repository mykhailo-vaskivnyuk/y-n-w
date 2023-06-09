/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import * as T from '../../server/types/types';
import { IClientAppThis } from '../types';
import { AppStatus } from '../constants';
import { Messenger } from './messenger.class';

type IApp = IClientAppThis & {
  onNewUser: (readChanges?: boolean) => Promise<void>;
}

export class Account {
  private user: T.IUserResponse = null;
  public messenger: Messenger;

  constructor(private app: IApp) {
    this.messenger = new Messenger(app);
  }

  getUser() {
    return this.user;
  }

  async init() {
    const user = await this.app.api.user.read();
    await this.setUser(user);
  }

  private async setUser(user: T.IUserResponse) {
    if (this.user === user) return;
    this.user = user;
    await this.app.onNewUser();
    this.app.emit('user', user);
  }

  async loginOrSignup(
    type: 'login' | 'signup', args: T.ILoginParams | T.ISignupParams,
  ) {
    await await this.app.setStatus(AppStatus.LOADING);
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
    await await this.app.setStatus(AppStatus.LOADING);
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
    await this.app.setStatus(AppStatus.LOADING);
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
    await this.app.setStatus(AppStatus.LOADING);
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

  async update(data: T.IUserUpdateParams): Promise<T.IUserResponse> {
    await this.app.setStatus(AppStatus.LOADING);
    try {
      const user = await this.app.api.user.update(data);
      user && await this.setUser(user);
      this.app.setStatus(AppStatus.READY);
      return user;
    } catch (e: any) {
      this.app.setError(e);
      throw e;
    }
  }
}
