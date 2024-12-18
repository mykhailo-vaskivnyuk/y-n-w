/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import * as T from '../../server/types/types';
import { IClientAppThis, IMember } from '../types';
import { AppStatus } from '../constants';
import { HttpResponseError } from '../connection/errors';
import { getMemberStatus } from '../../server/utils';
import { Member } from './member.class';
import { MemberActions } from './memberActions.class';
import { NetBoard } from './net.board.class';

type IApp = IClientAppThis & {
  onNewNet: () => void;
  onNewNets: () => Promise<void>;
};

export class Net {
  private userNet: T.INetResponse = null;
  private userNetData: T.IUserNetDataResponse | null = null;
  private circle: IMember[] = [];
  private tree: IMember[] = [];
  private netView?: T.NetViewEnum;
  public member: Member | null = null;
  public memberActions: MemberActions;
  public board: NetBoard;

  constructor(private app: IApp) {
    this.memberActions = new MemberActions(app, this as any);
    this.board = new NetBoard(app);
  }

  async onNetChanged() {
    this.enter(this.userNet!.net_id, true);
  }

  async onMemberChanged() {
    if (this.netView === 'tree') await this.getTree();
    else await this.getCircle();
    if (this.member) this.findMember(this.member.getMember().node_id);
  }

  async onUserNetDataChanged() {
    await this.getUserData(true);
    if (this.netView === 'tree') this.app.emit('tree', { ...this.tree });
    else this.app.emit('circle', { ...this.circle });
  }

  getNetState() {
    return {
      userNetData: this.userNetData,
      net: this.userNet,
      circle: this.circle,
      tree: this.tree,
      netView: this.netView,
      boardMessages: this.board.getState(),
      memberData: this.member?.getMember(),
    };
  }

  findMember(nodeId: number) {
    const { netView } = this.app.getState();
    const { [netView!]: netViewData } = this.app.getState();
    const memberPosition = netViewData.findIndex((item) => item.node_id === nodeId);
    const member = netViewData[memberPosition];
    this.member = new Member(member, this.app, this as any);
    if (!member) this.app.setError(new HttpResponseError(404));
  }

  private async setNet(userNet: T.INetResponse = null) {
    if (this.userNet === userNet) return;
    this.userNet = userNet;
    if (userNet) {
      await this.getUserData();
      const { confirmed } = this.userNetData!;
      confirmed && (await this.board.read());
      await this.getCircle();
      await this.getTree();
      if (this.member) this.findMember(this.member.getMember().node_id);
    } else {
      this.setUserNetData();
      this.board = new NetBoard(this.app);
      this.setCircle();
      this.setTree();
      this.setView();
      this.member = null;
    }
    await this.app.onNewNet();
    this.app.emit('net', userNet);
  }

  private setUserNetData(userNetData: T.IUserNetDataResponse | null = null) {
    if (this.userNetData === userNetData) return;
    this.userNetData = userNetData;
  }

  setView(netView?: T.NetViewEnum) {
    this.netView = netView;
    this.app.emit('netView', this.netView);
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
    try {
      await this.app.setStatus(AppStatus.LOADING);
      const parentNet = this.userNet;
      const net = await this.app.api.net.create({
        node_id: null,
        ...parentNet,
        ...args,
      });
      if (net) await this.app.onNewNets();
      this.app.setStatus(AppStatus.READY);
      return net;
    } catch (e: any) {
      this.app.setError(e);
    }
  }

  async enter(net_id: number, inChain = false) {
    try {
      !inChain && (await this.app.setStatus(AppStatus.LOADING));
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

  async getUserData(inChain = false) {
    try {
      !inChain && (await this.app.setStatus(AppStatus.LOADING));
      const net_id = this.userNet!.net_id;
      const userNetData = await this.app.api.user.net.getData({ net_id });
      await this.setUserNetData(userNetData);
      !inChain && this.app.setStatus(AppStatus.READY);
      return userNetData;
    } catch (e: any) {
      if (inChain) throw e;
      await this.setUserNetData();
      this.app.setError(e);
    }
  }

  async comeout() {
    try {
      await this.app.setStatus(AppStatus.LOADING);
      await this.setNet();
      this.app.setStatus(AppStatus.READY);
      return true;
    } catch (e: any) {
      this.app.setError(e);
      throw e;
    }
  }

  async leave() {
    try {
      await this.app.setStatus(AppStatus.LOADING);
      const net = this.userNet;
      const success = await this.app.api.net.leave(net!);
      if (success) {
        await this.app.onNewNets();
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
      const memberName = this.memberActions.getName('circle', member, memberPosition);
      return { ...member, member_name: memberName, memberStatus };
    });
    this.setCircle(circle);
  }

  async getTree() {
    const net = this.userNet;
    const result = await this.app.api.net.getTree(net!);
    const tree: IMember[] = result.map((member, memberPosition) => {
      const memberStatus = getMemberStatus(member);
      const memberName = this.memberActions.getName('tree', member, memberPosition);
      return { ...member, member_name: memberName, memberStatus };
    });
    this.setTree(tree);
  }

  async connectByInvite(args: T.ITokenParams) {
    try {
      await this.app.setStatus(AppStatus.LOADING);
      const result = await this.app.api.net.connectByToken(args);
      const { error } = result || {};
      if (!error) await this.app.onNewNets();
      this.app.setStatus(AppStatus.READY);
      return result;
    } catch (e: any) {
      this.app.setError(e);
      throw e;
    }
  }

  async update(args: Omit<T.INetUpdateParams, 'node_id'>) {
    try {
      await this.app.setStatus(AppStatus.LOADING);
      const net = await this.app.api.net.update({ ...this.userNet!, ...args });
      net && this.setNet(net);
      this.app.setStatus(AppStatus.READY);
      return net;
    } catch (e: any) {
      this.app.setError(e);
      throw e;
    }
  }

  async getNetWaiting() {
    try {
      await this.app.setStatus(AppStatus.LOADING);
      const { node_id } = this.userNet || {};
      if (!node_id) throw new Error('Net is not defined');
      const result = await this.app.api.net.wait.get({ node_id });
      this.app.setStatus(AppStatus.READY);
      return result;
    } catch (e: any) {
      this.app.setError(e);
      throw e;
    }
  }
}
