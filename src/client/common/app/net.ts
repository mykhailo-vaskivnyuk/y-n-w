/* eslint-disable import/no-cycle */
import { INetCreateParams } from '../api/types/net.types';
import { IClientAppThis } from './types';
import { AppState } from '../constants';

export const getNetMethods = (parent: IClientAppThis) => ({
  async create(args: INetCreateParams) {
    parent.setState(AppState.LOADING);
    try {
      const net = await parent.api.net.create(args);
      net && parent.setNet(net);
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
      await parent.api.user.net.enter({ net_id: null });
      parent.setNet(null);
      parent.setState(AppState.READY);
      return true;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  },

  async leave() {
    parent.setState(AppState.LOADING);
    try {
      const success = await parent.api.net.leave();
      if (success) {
        parent.setNet(null);
        await this.getNets();
      }
      parent.setState(AppState.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  },

  async getNets() {
    parent.setState(AppState.LOADING);
    try {
      // const { net_id: netId = null } = parent.getState().net || {};
      // const parentNets = await parent.api.net.getParents();
      const siblingNets = await parent.api.user.net.getChildren();
      // const childNets = await parent.api.user.net.getChildren();
      const userNets = { siblingNets };
      parent.setNets(userNets);
      parent.setState(AppState.READY);
    } catch (e: any) {
      parent.setError(e);
    }
  },
});
