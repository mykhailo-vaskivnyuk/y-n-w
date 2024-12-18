/* eslint-disable import/no-cycle */
import { IClientAppThis } from '../types';
import { AppStatus } from '../constants';

type IApp = IClientAppThis;

export class Messenger {
  private botName = '';

  constructor(private app: IApp) {}

  async init() {
    this.botName = (await this.getBotName()) || '';
  }

  getState() {
    return this.botName;
  }

  async getLink() {
    try {
      await this.app.setStatus(AppStatus.LOADING);
      const token = await this.app.api.account.messenger.link.get();
      this.app.setStatus(AppStatus.READY);
      return token;
    } catch (e: any) {
      this.app.setError(e);
    }
  }

  async getBotName() {
    try {
      await this.app.setStatus(AppStatus.LOADING);
      const name = await this.app.api.account.messenger.get.name();
      this.app.setStatus(AppStatus.READY);
      return name;
    } catch (e: any) {
      this.app.setError(e);
    }
  }
}
