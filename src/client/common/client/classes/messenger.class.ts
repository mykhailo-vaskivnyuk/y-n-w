/* eslint-disable import/no-cycle */
import { IClientAppThis } from '../types';
import { AppStatus } from '../constants';

type IApp = IClientAppThis;

export class Messenger {

  constructor(private app: IApp) {}

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
}
