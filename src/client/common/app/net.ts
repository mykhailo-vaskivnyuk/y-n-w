/* eslint-disable import/no-cycle */
import { TNetCreate } from '@api/api/client.api.types';
import { AppState } from '../constants';
import { IClientAppThis } from './types';

export const getNetMethods = (parent: IClientAppThis) => ({
  async create(args: TNetCreate) {
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
