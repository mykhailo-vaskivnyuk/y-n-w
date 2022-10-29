import { AppState } from './constants';
import { IUser } from './types';
import EventEmmiter from './event.emmiter';
import { api } from './client.api';
import { getConnection } from './client.fetch';

class ClientApp extends EventEmmiter {
  private clientApi;

  private state: AppState = AppState.INIT;

  private user: IUser | null = null;

  constructor(baseUrl: string) {
    super();
    const connection = getConnection(baseUrl);
    this.clientApi = api(connection);
  }

  async init() {
    await this.readUser();
  }

  getUser() {
    return this.user;
  }

  private setUser(user: IUser | null) {
    this.user = user;
    this.emit('user', this.user);
  }

  private setState(state: AppState) {
    this.state = state;
    this.emit('statechanged', this.state);
  }

  private async readUser(...args: Parameters<typeof this.clientApi.user.read>) {
    this.setState(AppState.LOADING);
    let user = null;
    try {
      user = await this.clientApi.user.read(...args);
      this.setUser(user);
      this.setState(AppState.READY);
      return Boolean(user);
    } catch (e) {
      this.setState(AppState.ERROR);
    }
  }

  async login(...args: Parameters<typeof this.clientApi.account.login>) {
    this.setState(AppState.LOADING);
    let user = null;
    try {
      user = await this.clientApi.account.login(...args);
      this.setState(AppState.READY);
      if (!user) return false;
      this.setUser(user);
      return true;
    } catch (e) {
      this.setState(AppState.ERROR);
      return false;
    }
  }

  async logout(...args: Parameters<typeof this.clientApi.account.logout>) {
    this.setState(AppState.LOADING);
    try {
      await this.clientApi.account.logout(...args);
      this.setUser(null);
      this.setState(AppState.READY);
      return true;
    } catch (e) {
      this.setState(AppState.ERROR);
    }
  }

  async signup(...args: Parameters<typeof this.clientApi.account.signup>) {
    this.setState(AppState.LOADING);
    try {
      const user = await this.clientApi.account.signup(...args);
      user && this.setUser(user);
      this.setState(AppState.READY);
      return Boolean(user);
    } catch (e) {
      this.setState(AppState.ERROR);
      throw e;
    }
  }

  async overmail(...args: Parameters<typeof this.clientApi.account.signup>) {
    this.setState(AppState.LOADING);
    try {
      const success = await this.clientApi.account.overmail(...args);
      if (!success) return false;
      this.setState(AppState.READY);
      return true;
    } catch (e) {
      this.state = AppState.ERROR;
    }
  }

  async confirm(...args: Parameters<typeof this.clientApi.account.confirm>) {
    this.setState(AppState.LOADING);
    try {
      const user = await this.clientApi.account.confirm(...args);
      user && this.setUser(user);
      this.setState(AppState.READY);
      return Boolean(user);
    } catch (e) {
      this.setState(AppState.ERROR);
      throw e;
    }
  }

  async restore(...args: Parameters<typeof this.clientApi.account.restore>) {
    this.setState(AppState.LOADING);
    try {
      const user = await this.clientApi.account.restore(...args);
      user && this.setUser(user);
      this.setState(AppState.READY);
      return Boolean(user);
    } catch (e) {
      this.setState(AppState.ERROR);
      throw e;
    }
  }

  async removeUser() {
    this.setState(AppState.LOADING);
    try {
      const success = await this.clientApi.account.remove();
      if (success) {
        this.setUser(null);
        this.setState(AppState.READY);
        return true;
      }

      this.setState(AppState.READY);
      return false;
    } catch (e) {
      this.setState(AppState.ERROR);
    }
  }
}

let baseUrl = process.env.API;

if (!baseUrl) {
  const { protocol, host } = window.location;
  baseUrl = `${protocol}//${host}/api`;
}

export const app = new ClientApp(baseUrl);
