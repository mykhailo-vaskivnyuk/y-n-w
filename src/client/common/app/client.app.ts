/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import { INetCreateResponse } from '../api/types/net.types';
import { IUserResponse } from '../api/types/types';
import { AppState } from '../constants';
import { HttpResponseError } from '../errors';
import EventEmitter from '../event.emitter';
import { getApi, IClientApi } from '../api/client.api';
import { getAccountMethods } from './account';
import { getConnection as getHttpConnection } from '../client.http';
import { getConnection as getWsConnection } from '../client.ws';
import { getNetMethods } from './net';

export class ClientApp extends EventEmitter {
  protected clientApi: IClientApi | null;
  private baseUrl = '';
  protected state: AppState = AppState.INITING;
  private user: IUserResponse = null;
  private user_net: INetCreateResponse | null = null;
  private error: HttpResponseError | null = null;
  account: ReturnType<typeof getAccountMethods>;
  net: ReturnType<typeof getNetMethods>;

  constructor() {
    super();
    this.account = getAccountMethods(this as any);
    this.net = getNetMethods(this as any);
    this.baseUrl = process.env.API || `${window.location.origin}/api`;
  }

  async init() {
    try {
      const connection = await getHttpConnection(this.baseUrl);
      this.clientApi = getApi(connection);
      await this.clientApi.health();
    } catch (e: any) {
      if (!(e instanceof HttpResponseError)) return this.setError(e);
      if (e.statusCode !== 503) return this.setError(e);
      try {
        const baseUrl = this.baseUrl.replace('http', 'ws');
        const connection = await getWsConnection(baseUrl);
        this.clientApi = getApi(connection);
        await this.clientApi.health();
      } catch (err: any) {
        return this.setError(err);
      }
    }
    await this.readUser();
    this.setState(AppState.INITED);
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

  protected setNet(net: INetCreateResponse) {
    this.user_net = net;
    this.emit('net', net);
  }

  protected setState(state: AppState) {
    if (state === AppState.ERROR) {
      this.state = state;
      this.emit('error', this.error);
      return this.emit('statechanged', this.state);
    }
    this.error = null;
    if (state === AppState.INITED) {
      this.state = state;
      return this.emit('statechanged', this.state);
    }
    if (this.state === AppState.INITING) return;
    this.state = state;
    return this.emit('statechanged', this.state);
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
    } catch (e: any) {
      this.setError(e);
    }
  }
}

export const app = new ClientApp();
