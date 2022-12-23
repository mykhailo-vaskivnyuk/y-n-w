/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import { INetCreateParams, ITokenParams } from '../../api/types/types';
import { INITIAL_NETS, IClientAppThis, IMember } from '../types';
import { AppStatus } from '../../constants';

export const getNetMethods = (parent: IClientAppThis) => ({
  async create(args: INetCreateParams) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const net = await parent.api.net.create(args);
      if (net) {
        this.getAllNets();
        await parent.setNet(net);
      }
      parent.setStatus(AppStatus.READY);
      return net;
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async enter(net_id: number) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const net = await parent.api.net.enter({ net_id });
      await parent.setNet(net);
      parent.setStatus(AppStatus.READY);
      return net;
    } catch (e: any) {
      await parent.setNet(null);
      parent.setError(e);
    }
  },

  async comeout() {
    parent.setStatus(AppStatus.LOADING);
    try {
      const success = await parent.api.net.comeout();
      if (success) await parent.setNet(null);
      parent.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  },

  async leave() {
    parent.setStatus(AppStatus.LOADING);
    try {
      const success = await parent.api.net.leave();
      if (success) {
        await this.getAllNets();
        await parent.setNet(null);
      }
      parent.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  },

  async getCircle() {
    parent.setStatus(AppStatus.LOADING);
    try {
      const result = await parent.api.net.getCircle();
      const circle: IMember[] = result.map((member, memberPosition) => {
        const memberStatus = parent.member.getStatus(member);
        const memberName = parent
          .member
          .getName('circle', member, memberPosition);
        return { ...member, member_name: memberName, memberStatus };
      });
      parent.setCircle(circle);
      parent.setStatus(AppStatus.READY);
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async getTree() {
    parent.setStatus(AppStatus.LOADING);
    try {
      const result = await parent.api.net.getTree();
      const tree: IMember[] = result.map((member, memberPosition) => {
        const memberStatus = parent.member.getStatus(member);
        const memberName = parent
          .member
          .getName('tree', member, memberPosition);
        return { ...member, member_name: memberName, memberStatus };
      });
      parent.setTree(tree);
      parent.setStatus(AppStatus.READY);
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async getAllNets() {
    parent.setStatus(AppStatus.LOADING);
    try {
      const nets = await parent.api.user.nets.get();
      parent.setAllNets(nets);
      parent.setStatus(AppStatus.READY);
    } catch (e: any) {
      parent.setError(e);
    }
  },

  getNets() {
    const { net, allNets } = parent.getState();
    const {
      net_id: netId = null,
      parent_net_id: parentNetId = null,
    } = net || {};
    const nets = { ...INITIAL_NETS };
    nets.siblingNets = allNets
      .filter(({ parent_net_id }) => parent_net_id === parentNetId,
      );
    if (!net) return parent.setNets(nets);
    nets.childNets = allNets
      .filter((item) => item.parent_net_id === netId);
    let curParentNetId = parentNetId;
    nets.parentNets = allNets
      .reduceRight((acc, item) => {
        if (!curParentNetId) return acc;
        const { net_id: curNetId, parent_net_id: nextParentNetId } = item;
        if (curNetId !== curParentNetId) return acc;
        acc.push(item);
        curParentNetId = nextParentNetId;
        return acc;
      }, [...nets.parentNets])
      .reverse();
    parent.setNets(nets);
  },

  async connectByInvite(args: ITokenParams) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const result = await parent.api.net.connectByToken(args);
      const { error } = result || {};
      if (!error) await this.getAllNets();
      parent.setStatus(AppStatus.READY);
      return result;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  }
});
