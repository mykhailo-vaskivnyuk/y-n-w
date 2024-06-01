/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import * as T from '../../server/types/types';
import { AppStatus } from '../constants';
import { INITIAL_NETS, IClientAppThis, INets } from '../types';

type IApp = IClientAppThis;

export class UserNets {
  private allNets: T.INetsResponse = [];
  private nets: INets = INITIAL_NETS;
  private waitNets: T.IWaitNets = [];

  constructor(private app: IApp) {}

  getUserNets() {
    return {
      nets: this.nets,
      waitNets: this.waitNets,
    };
  }

  private setAllNets(nets: T.INetsResponse) {
    if (this.allNets === nets) return;
    this.allNets = nets;
    this.app.emit('allnets', nets);
    this.getNets();
  }

  private setNets(nets: INets) {
    if (this.nets === nets) return;
    this.nets = nets;
    this.app.emit('nets', nets);
  }

  async getAllNets() {
    const allNets = await this.app.api.user.nets.get.all();
    this.setAllNets(allNets);
  }

  getNets() {
    const { net } = this.app.getState();
    const {
      net_id: netId = null,
      parent_net_id: parentNetId = null,
    } = net || {};
    const nets = { ...INITIAL_NETS };
    nets.siblingNets = this.allNets
      .filter(({ parent_net_id }) => parent_net_id === parentNetId,
      );
    if (!net) return this.setNets(nets);
    nets.childNets = this.allNets
      .filter((item) => item.parent_net_id === netId);
    let curParentNetId = parentNetId;
    nets.parentNets = this.allNets
      .reduceRight((acc, item) => {
        if (!curParentNetId) return acc;
        const { net_id: curNetId, parent_net_id: nextParentNetId } = item;
        if (curNetId !== curParentNetId) return acc;
        acc.push(item);
        curParentNetId = nextParentNetId;
        return acc;
      }, [...nets.parentNets])
      .reverse();
    this.setNets(nets);
  }

  async getWaitNets(inChain = false) {
    try {
      !inChain && await this.app.setStatus(AppStatus.LOADING);
      this.waitNets = await this.app.api.user.nets.get.wait();
      !inChain && this.app.setStatus(AppStatus.READY);
      this.app.emit('waitNets', this.waitNets);
    } catch (e: any) {
      if (inChain) throw e;
      this.app.setError(e);
    }
  }

  async waitCreate(args: T.ITokenParams) {
    try {
      await this.app.setStatus(AppStatus.LOADING);
      const result = await this.app.api.net.wait.create(args);
      const { error } = result || {};
      if (!error) await this.getWaitNets(true);
      this.app.setStatus(AppStatus.READY);
      return result;
    } catch (e: any) {
      this.app.setError(e);
      throw e;
    }
  }

  async waitRemove(args: T.INetEnterParams) {
    try {
      await this.app.setStatus(AppStatus.LOADING);
      await this.app.api.net.wait.remove(args);
      await this.getWaitNets(true);
      this.app.setStatus(AppStatus.READY);
    } catch (e: any) {
      this.app.setError(e);
      throw e;
    }
  }
}
