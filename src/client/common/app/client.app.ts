/* eslint-disable import/no-cycle */
import { HttpResponseError } from '../errors';
import { AppState } from '../constants';
import { IUserResponse } from '../api/types';
import EventEmitter from '../event.emitter';
import { getApi, IClientApi } from '../api/client.api';
import { getAccountMethods } from './account';
import { getConnection as getHttpConnection } from '../client.http';
import { getConnection as getWsConnection } from '../client.ws';

export type ClientAppThis = ClientApp & {
  state: AppState;
  clientApi: ReturnType<typeof getApi>;
  setState: (state: AppState) => void;
  setUser: (user: IUserResponse) => void;
  setError: (e: HttpResponseError) => void;
};

export class ClientApp extends EventEmitter {
  protected clientApi: IClientApi | null;

  private baseUrl = '';

  protected state: AppState = AppState.INIT;

  private user: IUserResponse = null;

  private error: HttpResponseError | null = null;

  account: ReturnType<typeof getAccountMethods>;

  constructor() {
    super();
    this.account = getAccountMethods(this as unknown as ClientAppThis);
    this.baseUrl = process.env.API || `${window.location.host}/api`;
  }

  async init() {
    try {
      const baseUrl = `http://${this.baseUrl}`;
      const connection = await getHttpConnection(baseUrl);
      this.clientApi = getApi(connection);
      await this.clientApi.health();
    } catch (e) {
      if (!(e instanceof HttpResponseError)) return this.setState(AppState.ERROR);
      if (e.statusCode !== 503) return this.setState(AppState.ERROR);
      try {
        const baseUrl = `ws://${this.baseUrl}`;
        const connection = await getWsConnection(baseUrl);
        this.clientApi = getApi(connection);
        await this.clientApi.health();
      } catch (err) {
        return this.setState(AppState.ERROR);
      }
    }
    await this.readUser();
    this.state = AppState.READY;
    this.emit('statechanged', this.state);
  }

  getState() {
    return {
      state: this.state,
      user: this.user,
      error: this.error,
    };
  }

  protected setUser(user: IUserResponse) {
    this.user = user;
    this.emit('user', user);
  }

  protected setState(state: AppState) {
    if (state !== AppState.ERROR && this.state === AppState.INIT) return;
    this.state = state;
    this.error = null;
    if (state !== AppState.READY) {
      return this.emit('statechanged', this.state);
    }
    Promise.resolve()
      .then(() => this.emit('statechanged', this.state))
      .catch((e) => console.log(e));
  }

  protected setError(e: HttpResponseError) {
    this.error = e;
    this.setState(AppState.ERROR);
  }

  private async readUser() {
    this.setState(AppState.LOADING);
    try {
      const user = await this.clientApi!.user.read();
      this.setUser(user);
      this.setState(AppState.READY);
      return user;
    } catch (e) {
      this.setState(AppState.ERROR);
    }
  }
}

export const app = new ClientApp();
