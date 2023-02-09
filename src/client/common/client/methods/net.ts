/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import * as T from '../../server/types/types';
import { INITIAL_NETS, IClientAppThis, IMember } from '../types';
import { AppStatus } from '../constants';
import { getNetBoardMethods } from './net.board';
import { getMemberStatus } from '../../server/utils';

export const getNetMethods = (parent: IClientAppThis) => ({
  board: getNetBoardMethods(parent),

  async create(args: Omit<T.INetCreateParams, 'node_id'>) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const { net: parentNet } = parent.getState();
      const net = await parent.api.net.create({
        node_id: null,
        ...parentNet,
        ...args,
      });
      if (net) this.getAllNets();
      parent.setStatus(AppStatus.READY);
      return net;
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async enter(net_id: number, inChain = false) {
    !inChain && parent.setStatus(AppStatus.LOADING);
    try {
      const net = await parent.api.net.enter({ net_id });
      await parent.setNet(net);
      !inChain && parent.setStatus(AppStatus.READY);
      return net;
    } catch (e: any) {
      if (inChain) throw e;
      await parent.setNet();
      parent.setError(e);
      return null;
    }
  },

  async getUserData(net_id: number) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const userNetData = await parent.api.user.net.getData({ net_id });
      await parent.setUserNetData(userNetData);
      parent.setStatus(AppStatus.READY);
      return userNetData;
    } catch (e: any) {
      await parent.setUserNetData();
      parent.setError(e);
    }
  },

  async comeout() {
    parent.setStatus(AppStatus.LOADING);
    try {
      await parent.setNet();
      parent.setStatus(AppStatus.READY);
      return true;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  },

  async leave() {
    parent.setStatus(AppStatus.LOADING);
    try {
      const { net } = parent.getState();
      const success = await parent.api.net.leave(net!);
      if (success) {
        await this.getAllNets();
        await parent.setNet();
      }
      parent.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  },

  async getCircle() {
      const { net } = parent.getState();
      const result = await parent.api.net.getCircle(net!);
      const circle: IMember[] = result.map((member, memberPosition) => {
        const memberStatus = getMemberStatus(member);
        const memberName = parent
          .member
          .getName('circle', member, memberPosition);
        return { ...member, member_name: memberName, memberStatus };
      });
      parent.setCircle(circle);
  },

  async getTree() {

      const { net } = parent.getState();
      const result = await parent.api.net.getTree(net!);
      const tree: IMember[] = result.map((member, memberPosition) => {
        const memberStatus = getMemberStatus(member);
        const memberName = parent
          .member
          .getName('tree', member, memberPosition);
        return { ...member, member_name: memberName, memberStatus };
      });
      parent.setTree(tree);
  },

  setView(netView: T.NetViewEnum) {
    parent.setNetView(netView);
  },

  async getAllNets() {
    const nets = await parent.api.user.nets.get();
    await parent.chat.connectAll();
    parent.setAllNets(nets);
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

  async connectByInvite(args: T.ITokenParams) {
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
  },
});
