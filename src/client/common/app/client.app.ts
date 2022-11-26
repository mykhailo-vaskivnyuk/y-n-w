/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import { INetResponse, INetsResponse, IUserResponse } from '../api/types/types';
import { INITIAL_NETS, INets } from './types';
import { AppState } from '../constants';
import { HttpResponseError } from '../errors';
import EventEmitter from '../event.emitter';
import { getApi, IClientApi } from '../api/client.api';
import { getAccountMethods } from './methods/account';
import { getConnection as getHttpConnection } from '../client.http';
import { getConnection as getWsConnection } from '../client.ws';
import { getNetMethods } from './methods/net';

export class ClientApp extends EventEmitter {
  protected api: IClientApi | null;
  private baseUrl = '';
  private state: AppState = AppState.INITING;
  private user: IUserResponse = null;
  private net: INetResponse = null;
  private allNets: INetsResponse = [];
  private nets: INets = INITIAL_NETS;
  private error: HttpResponseError | null = null;
  account: ReturnType<typeof getAccountMethods>;
  netMethods: ReturnType<typeof getNetMethods>;

  constructor() {
    super();
    this.account = getAccountMethods(this as any);
    this.netMethods = getNetMethods(this as any);
    this.baseUrl = process.env.API || `${window.location.origin}/api`;
  }

  async init() {
    try {
      const connection = await getHttpConnection(this.baseUrl);
      this.api = getApi(connection);
      await this.api.health();
    } catch (e: any) {
      if (!(e instanceof HttpResponseError)) return this.setError(e);
      if (e.statusCode !== 503) return this.setError(e);
      try {
        const baseUrl = this.baseUrl.replace('http', 'ws');
        const connection = await getWsConnection(baseUrl);
        this.api = getApi(connection);
        await this.api.health();
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
      net: this.net,
      allNets: this.allNets,
      nets: this.nets,
      error: this.error,
    };
  }

  protected async setUser(user: IUserResponse) {
    if (this.user === user) return;
    this.user = user;
    if (user && user.user_state !== 'NOT_CONFIRMED') {
      await this.netMethods.getAllNets();
      this.netMethods.getNets();
    } else {
      this.setNets({ ...INITIAL_NETS });
    }
    this.emit('user', user);
  }

  protected async setNet(net: INetResponse | null = null) {
    if (this.net === net) return;
    this.net = net;
    if (net) {
      this.user!.user_state = 'INSIDE_NET';
      this.emit('user', { ...this.user });
    } else if (this.user) {
      this.user!.user_state = 'LOGGEDIN';
      this.emit('user', { ...this.user });
    }
    this.netMethods.getNets();
    this.emit('net', net);
  }

  protected async setAllNets(nets: INetsResponse) {
    if (this.allNets === nets) return;
    this.allNets = nets;
  }

  protected setNets(nets: INets) {
    if (this.nets === nets) return;
    this.nets = nets;
    this.emit('nets', this.nets);
  }

  protected setState(state: AppState) {
    if (state === AppState.ERROR) {
      this.state = state;
      this.emit('error', this.error);
      return this.emit('statechanged', this.state);
    }
    this.error = null;
    if (state === AppState.INITED) {
      this.state = AppState.READY;
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
      const user = await this.api!.user.read();
      await this.setUser(user);
      this.setState(AppState.READY);
      return user;
    } catch (e: any) {
      this.setError(e);
    }
  }
}

export const app = new ClientApp();
