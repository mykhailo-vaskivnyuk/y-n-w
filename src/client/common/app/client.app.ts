/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import {
  INetViewResponse, INetResponse,
  INetsResponse, IUserResponse, NetViewKeys, IMemberResponse,
} from '../api/types/types';
import { INITIAL_NETS, INets } from './types';
import { AppStatus } from '../constants';
import { HttpResponseError } from '../errors';
import { EventEmitter } from '../event.emitter';
import { getApi, IClientApi } from '../api/client.api';
import { getAccountMethods } from './methods/account';
import { getConnection as getHttpConnection } from '../client.http';
import { getConnection as getWsConnection } from '../client.ws';
import { getNetMethods } from './methods/net';

export class ClientApp extends EventEmitter {
  private baseUrl = '';
  protected api: IClientApi | null;

  private status: AppStatus = AppStatus.INITING;
  private error: HttpResponseError | null = null;

  private user: IUserResponse = null;
  private allNets: INetsResponse = [];
  private nets: INets = INITIAL_NETS;
  private net: INetResponse = null;
  private circle: INetViewResponse = [];
  private tree: INetViewResponse = [];
  private netView?: NetViewKeys;
  private member?: IMemberResponse;

  account: ReturnType<typeof getAccountMethods>;
  netMethods: ReturnType<typeof getNetMethods>;

  constructor() {
    super();
    this.account = getAccountMethods(this as any);
    this.netMethods = getNetMethods(this as any);
    this.baseUrl = process.env.API || `${window.location.origin}/api`;
  }

  getState() {
    return {
      status: this.status,
      error: this.error,
      user: this.user,
      net: this.net,
      circle: this.circle,
      tree: this.tree,
      allNets: this.allNets,
      nets: this.nets,
      netView: this.netView,
      member: this.member,
    };
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
    this.setStatus(AppStatus.INITED);
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
    this.setCircle([]);
    this.setTree([]);
    this.netView = undefined;
    this.member = undefined;
    if (net) {
      this.user!.user_state = 'INSIDE_NET';
      await this.netMethods.getCircle();
      await this.netMethods.getTree();
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

  protected setCircle(circle: INetViewResponse) {
    if (this.circle === circle) return;
    this.circle = circle;
  }

  protected setTree(tree: INetViewResponse) {
    if (this.tree === tree) return;
    this.tree = tree;
  }

  protected setStatus(status: AppStatus) {
    if (status === AppStatus.ERROR) {
      this.status = status;
      this.emit('error', this.error);
      return this.emit('statuschanged', this.status);
    }
    this.error = null;
    if (status === AppStatus.INITED) {
      this.status = AppStatus.READY;
      return this.emit('statuschanged', this.status);
    }
    if (this.status === AppStatus.INITING) return;
    this.status = status;
    return this.emit('statuschanged', this.status);
  }

  protected setError(e: HttpResponseError) {
    this.error = e;
    this.setStatus(AppStatus.ERROR);
  }

  private async readUser() {
    this.setStatus(AppStatus.LOADING);
    try {
      const user = await this.api!.user.read();
      await this.setUser(user);
      this.setStatus(AppStatus.READY);
      return user;
    } catch (e: any) {
      this.setError(e);
    }
  }

  async getMember(netView: NetViewKeys, nodeId: number) {
    this.netView = netView;
    this.member = this.tree.find((item) => item.node_id === Number(nodeId));
    return this.member;
  }
}

export const app = new ClientApp();
