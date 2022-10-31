/* eslint-disable import/no-cycle */
import { IUserResponse } from '../api/types';
import { AppState } from '../constants';
import { ClientAppThis } from './client.app';
import { api } from '../api/client.api';

type TLoginOrSignup =
  | ['login', Parameters<ReturnType<typeof api>['account']['login']>[0]]
  | ['signup', Parameters<ReturnType<typeof api>['account']['signup']>[0]];

export const getAccountMethods = (parent: ClientAppThis) => ({
  async loginOrSignup(...[type, args]: TLoginOrSignup) {
    parent.setState(AppState.LOADING);
    try {
      const user = await parent.clientApi.account[type](args as any);
      user && parent.setUser(user);
      parent.setState(AppState.READY);
      return user;
    } catch (e) {
      parent.setState(AppState.ERROR);
      throw e;
    }
  },

  async logoutOrRemove(type: 'logout' | 'remove') {
    parent.setState(AppState.LOADING);
    try {
      const success = await parent.clientApi.account[type]();
      success && parent.setUser(null);
      parent.setState(AppState.READY);
      return success;
    } catch (e) {
      parent.setState(AppState.ERROR);
      throw e;
    }
  },

  async overmail(...args: Parameters<typeof parent.clientApi.account.overmail>) {
    parent.setState(AppState.LOADING);
    try {
      const success = await parent.clientApi.account.overmail(...args);
      parent.setState(AppState.READY);
      return success;
    } catch (e) {
      parent.setState(AppState.ERROR);
      throw e;
    }
  },

  async loginOverLink(
    type: 'confirm' | 'restore',
    ...args: Parameters<typeof parent.clientApi.account.confirm>
  ): Promise<IUserResponse> {
    parent.setState(AppState.LOADING);
    try {
      const user = await parent.clientApi.account[type](...args);
      user && parent.setUser(user);
      parent.setState(AppState.READY);
      return user;
    } catch (e) {
      parent.setState(AppState.ERROR);
      throw e;
    }
  },
});
