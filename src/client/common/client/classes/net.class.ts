/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import * as T from '../../server/types/types';
import { IClientAppThis, IMember } from '../types';
import { AppStatus } from '../constants';
import { getMemberStatus } from '../../server/utils';
import { NetBoard } from './net.board.class';

type IApp = Pick<IClientAppThis,
  | 'api'
  | 'getState'
  | 'setStatus'
  | 'setError'
  | 'account'
  | 'userNets'
  | 'setMember'
  | 'member'
  | 'chat'
  | 'emit'
>;

export class Net{
  private userNet: T.INetResponse = null;
  private userNetData: T.IUserNetDataResponse | null = null;
  private circle: IMember[] = [];
  private tree: IMember[] = [];
  private netView?: T.NetViewEnum;
  
  public board: NetBoard;

  constructor(private app: IApp) {
    this.board = new NetBoard(app);
  }

  getNetState() {
    return {
      userNetData: this.userNetData,
      net: this.userNet,
      circle: this.circle,
      tree: this.tree,
      netView: this.netView,
      boardMessages: this.board.getState(),
    };
  }

  private async setNet(userNet: T.INetResponse = null) {
    if (this.userNet === userNet) return;
    this.userNet = userNet;
    if (userNet) {
      await this.getUserData(userNet.net_id);
      const userStatus = this.userNetData!.confirmed ?
        'INSIDE_NET' :
        'INVITING';
      userStatus === 'INSIDE_NET' && await this.board.read();
      await this.getCircle();
      await this.getTree();
      this.app.account.setUserStatus(userStatus);
    } else {
      this.setUserNetData();
      this.board = new NetBoard(this as any);
      this.setCircle();
      this.setTree();
      this.setView();
      this.app.setMember();
      this.app.account.setUserStatus('LOGGEDIN');
    }
    this.app.userNets.getNets();
    this.app.emit('net', userNet);
  }

  private setUserNetData(
    userNetData: T.IUserNetDataResponse | null = null,
  ) {
    if (this.userNetData === userNetData) return;
    this.userNetData = userNetData;
  }

  setView(netView?: T.NetViewEnum) {
    this.netView = netView;
  }

  private setCircle(circle: IMember[] = []) {
    if (this.circle === circle) return;
    this.circle = circle;
    this.app.emit('circle', circle);
  }

  private setTree(tree: IMember[] = []) {
    if (this.tree === tree) return;
    this.tree = tree;
    this.app.emit('tree', tree);
  }

  async create(args: Omit<T.INetCreateParams, 'node_id'>) {
    this.app.setStatus(AppStatus.LOADING);
    try {
      const parentNet = this.userNet;
      const net = await this.app.api.net.create({
        node_id: null,
        ...parentNet,
        ...args,
      });
      if (net) this.app.userNets.getAllNets();
      this.app.setStatus(AppStatus.READY);
      return net;
    } catch (e: any) {
      this.app.setError(e);
    }
  }

  async enter(net_id: number, inChain = false) {
    !inChain && this.app.setStatus(AppStatus.LOADING);
    try {
      const net = await this.app.api.net.enter({ net_id });
      await this.setNet(net);
      !inChain && this.app.setStatus(AppStatus.READY);
      return net;
    } catch (e: any) {
      if (inChain) throw e;
      await this.setNet();
      this.app.setError(e);
      return null;
    }
  }

  async getUserData(net_id: number) {
    this.app.setStatus(AppStatus.LOADING);
    try {
      const userNetData = await this.app.api.user.net.getData({ net_id });
      await this.setUserNetData(userNetData);
      this.app.setStatus(AppStatus.READY);
      return userNetData;
    } catch (e: any) {
      await this.setUserNetData();
      this.app.setError(e);
    }
  }

  async comeout() {
    this.app.setStatus(AppStatus.LOADING);
    try {
      await this.setNet();
      this.app.setStatus(AppStatus.READY);
      return true;
    } catch (e: any) {
      this.app.setError(e);
      throw e;
    }
  }

  async leave() {
    this.app.setStatus(AppStatus.LOADING);
    try {
      const net = this.userNet;
      const success = await this.app.api.net.leave(net!);
      if (success) {
        await this.app.userNets.getAllNets();
        await this.setNet();
      }
      this.app.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      this.app.setError(e);
      throw e;
    }
  }

  async getCircle() {
      const net = this.userNet;
      const result = await this.app.api.net.getCircle(net!);
      const circle: IMember[] = result.map((member, memberPosition) => {
        const memberStatus = getMemberStatus(member);
        const memberName = this.app
          .member
          .getName('circle', member, memberPosition);
        return { ...member, member_name: memberName, memberStatus };
      });
      this.setCircle(circle);
  }

  async getTree() {
      const net = this.userNet;
      const result = await this.app.api.net.getTree(net!);
      const tree: IMember[] = result.map((member, memberPosition) => {
        const memberStatus = getMemberStatus(member);
        const memberName = this.app
          .member
          .getName('tree', member, memberPosition);
        return { ...member, member_name: memberName, memberStatus };
      });
      this.setTree(tree);
  }

  async connectByInvite(args: T.ITokenParams) {
    this.app.setStatus(AppStatus.LOADING);
    try {
      const result = await this.app.api.net.connectByToken(args);
      const { error } = result || {};
      if (!error) await this.app.userNets.getAllNets();
      this.app.setStatus(AppStatus.READY);
      return result;
    } catch (e: any) {
      this.app.setError(e);
      throw e;
    }
  }
}
