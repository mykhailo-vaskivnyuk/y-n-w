/* eslint-disable import/no-cycle */
import { INetCreateParams } from '../../api/types/net.types';
import { INITIAL_NETS, IClientAppThis } from '../types';
import { AppState } from '../../constants';

export const getNetMethods = (parent: IClientAppThis) => ({
  async create(args: INetCreateParams) {
    parent.setState(AppState.LOADING);
    try {
      const net = await parent.api.user.net.create(args);
      if (net) {
        this.getAllNets();
        parent.setNet(net);
      }
      parent.setState(AppState.READY);
      return net;
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async enter(net_id: number) {
    parent.setState(AppState.LOADING);
    try {
      const net = await parent.api.user.net.enter({ net_id });
      net && parent.setNet(net);
      parent.setState(AppState.READY);
      return net;
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async comeout() {
    parent.setState(AppState.LOADING);
    try {
      const success = await parent.api.user.net.comeout();
      if (success) {
        parent.setNet(null);
        parent.setState(AppState.READY);
      }
      return success;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  },

  async leave() {
    parent.setState(AppState.LOADING);
    try {
      const success = await parent.api.user.net.leave();
      if (success) {
        await this.getAllNets();
        parent.setNet(null);
      }
      parent.setState(AppState.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  },

  async getAllNets() {
    parent.setState(AppState.LOADING);
    try {
      const nets = await parent.api.user.nets.get();
      parent.setAllNets(nets);
      parent.setState(AppState.READY);
    } catch (e: any) {
      parent.setError(e);
    }
  },

  getNets() {
    const { net, allNets } = parent.getState();
    const nets = { ...INITIAL_NETS };
    if (!net) {
      nets.childNets = allNets.filter((item) => item.parent_net_id === null);
      parent.setNets(nets);
      return;
    }
    if (net.parent_net_id !== null) {
      nets.parentNets = allNets.filter((item) =>
        item.first_net_id === net.first_net_id &&
        item.net_level < net.net_level,
      );
    }
    nets.siblingNets = allNets
      .filter((item) => item.parent_net_id === net.parent_net_id,
    );
    nets.childNets = allNets
      .filter((item) => item.parent_net_id === net.net_id);
    parent.setNets(nets);
  },
});
