/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import * as T from '../../server/types/types';
import { IClientAppThis } from '../types';
import { AppStatus, TELEGRAM, USE_TG } from '../constants';
import { Messenger } from './messenger.class';

type IApp = IClientAppThis & {
  onNewUser: (readChanges?: boolean) => Promise<void>;
}

export class Account {
  private user: T.IUserResponse = null;
  public messenger: Messenger;
  private tg?: WebApp;

  constructor(private app: IApp) {
    this.messenger = new Messenger(app);
    const { WebApp: webApp } = USE_TG ? TELEGRAM : Telegram;
    this.tg = webApp.initData ? webApp : undefined;
  }

  getState() {
    return {
      user: this.user,
      tg: this.tg,
      bot: this.messenger.getState(),
    };
  }

  async init() {
    let user;
    await this.messenger.init();
    if (this.tg) {
      user = await this.app.api.account.overtg(this.tg);
    } else {
      user = await this.app.api.user.read();
    }
    await this.setUser(user);
  }

  private async setUser(user: T.IUserResponse) {
    if (this.user === user) return;
    this.user = user;
    await this.app.onNewUser();
  }

  async loginOrSignup(
    type: 'login' | 'signup', args: T.ILoginParams | T.ISignupParams,
  ) {
    try {
      await this.app.setStatus(AppStatus.LOADING);
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
    try {
      await this.app.setStatus(AppStatus.LOADING);
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
    try {
      await this.app.setStatus(AppStatus.LOADING);
      const success = await this.app.api.account.overmail(args);
      this.app.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      this.app.setError(e);
    }
  }

  async signupTg() {
    try {
      await this.app.setStatus(AppStatus.LOADING);
      const user = await this.app.api.account.signupTg(this.tg!);
      user && await this.setUser(user);
      this.app.setStatus(AppStatus.READY);
      return user;
    } catch (e: any) {
      this.app.setError(e);
      throw e;
    }
  }

  async loginOverLink(
    type: 'confirm' | 'restore', args: T.ITokenParams,
  ): Promise<T.IUserResponse> {
    try {
      await this.app.setStatus(AppStatus.LOADING);
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
    try {
      await this.app.setStatus(AppStatus.LOADING);
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
