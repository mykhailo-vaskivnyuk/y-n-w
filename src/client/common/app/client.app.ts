/* eslint-disable import/no-cycle */
import { AppState } from '../constants';
import { IUserResponse } from '../api/types';
import EventEmitter from '../event.emitter';
import { api } from '../api/client.api';
import { getConnection } from '../client.fetch';
import { getAccountMethods } from './account';

export type ClientAppThis = ClientApp & {
  state: AppState;
  clientApi: ReturnType<typeof api>;
  setState: (state: AppState) => void;
  setUser: (user: IUserResponse) => void;
};

export class ClientApp extends EventEmitter {
  protected clientApi;

  protected state: AppState = AppState.INIT;

  private user: IUserResponse = null;

  account: ReturnType<typeof getAccountMethods>;

  constructor(baseUrl: string) {
    super();
    const connection = getConnection(baseUrl);
    this.clientApi = api(connection);
    this.account = getAccountMethods(this as unknown as ClientAppThis);
  }

  async init() {
    await this.readUser();
    this.state = AppState.READY;
    this.emit('statechanged', this.state);
  }

  getState() {
    return {
      state: this.state,
      user: this.user,
    };
  }

  protected setUser(user: IUserResponse) {
    this.user = user;
    this.emit('user', user);
  }

  protected setState(state: AppState) {
    if (this.state === AppState.INIT) return;
    this.state = state;
    if (state !== AppState.READY) {
      return this.emit('statechanged', this.state);
    }
    Promise.resolve()
      .then(() => this.emit('statechanged', this.state))
      .catch((e) => console.log(e));
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
}

let baseUrl = process.env.API;

if (!baseUrl) {
  const { protocol, host } = window.location;
  baseUrl = `${protocol}//${host}/api`;
}

export const app = new ClientApp(baseUrl);
