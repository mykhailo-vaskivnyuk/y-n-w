/* eslint-disable max-lines */
/* eslint-disable import/no-cycle */
import {
  INetCreateParams, ITokenParams, NetViewKeys,
} from '../../api/types/types';
import { INITIAL_NETS, IClientAppThis, IMember } from '../types';
import { AppStatus } from '../../constants';

export const getNetMethods = (parent: IClientAppThis) => ({
  async create(args: Omit<INetCreateParams, 'node_id'>) {
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

  async enter(net_node_id: number) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const net = await parent.api.net.enter({ net_node_id });
      await parent.setNet(net);
      parent.setStatus(AppStatus.READY);
      return net;
    } catch (e: any) {
      await parent.setNet();
      parent.setError(e);
    }
  },

  async getUserData(node_id: number) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const userNetData = await parent.api.user.net.getData({ node_id });
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
      parent.setNet();
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
    parent.setStatus(AppStatus.LOADING);
    try {
      const { net } = parent.getState();
      const result = await parent.api.net.getCircle(net!);
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
      const { net } = parent.getState();
      const result = await parent.api.net.getTree(net!);
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

  setView(netView: NetViewKeys) {
    parent.setNetView(netView);
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
      net_node_id: netId = null,
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
        const { net_node_id: curNetId, parent_net_id: nextParentNetId } = item;
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
  },

  async sendTreeMessage(message: string) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const { net, userNetData } = parent.getState();
      console.log('SEND MESSAGE', userNetData);
      const { node_id: chatId } = userNetData!;
      let success = false;
      if (chatId) {
        await parent.api.net.chat
          .send({ node_id: net!.node_id, chatId, message });
        success = true;
      }
      parent.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
    }
  },
});
