/* eslint-disable import/no-cycle */
import { INetCreateParams } from '../api/types/net.types';
import { IClientAppThis } from './types';
import { AppState } from '../constants';

export const getNetMethods = (parent: IClientAppThis) => ({
  async create(args: INetCreateParams) {
    parent.setState(AppState.LOADING);
    try {
      const net = await parent.clientApi.net.create(args);
      net && parent.setNet(net);
      parent.setState(AppState.READY);
      return net;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  },
});
