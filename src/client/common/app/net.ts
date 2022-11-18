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
      const net = await parent.api.net.enter({ net_id });
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
      const success = await parent.api.net.comeout();
      success && parent.setNet(null);
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
      const userNets = await parent.api.user.getNets();
      parent.setNets(userNets);
      parent.setState(AppState.READY);
    } catch (e: any) {
      parent.setError(e);
    }
  },
});
