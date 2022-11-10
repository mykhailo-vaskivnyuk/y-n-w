/* eslint-disable import/no-cycle */
import { IConfirmParams, ISignupParams, IUserResponse, TLoginOrSignup } from '../api/types';
import { AppState } from '../constants';
import { IClientAppThis } from './types';

export const getAccountMethods = (parent: IClientAppThis) => ({
  async loginOrSignup(...[type, args]: TLoginOrSignup) {
    parent.setState(AppState.LOADING);
    try {
      const user = await parent.clientApi.account[type](args as any);
      user && parent.setUser(user);
      parent.setState(AppState.READY);
      return user;
    } catch (e: any) {
      parent.setError(e);
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

  async overmail(args: ISignupParams) {
    parent.setState(AppState.LOADING);
    try {
      const success = await parent.clientApi.account.overmail(args);
      parent.setState(AppState.READY);
      return success;
    } catch (e) {
      parent.setState(AppState.ERROR);
      throw e;
    }
  },

  async loginOverLink(type: 'confirm' | 'restore', args: IConfirmParams): Promise<IUserResponse> {
    parent.setState(AppState.LOADING);
    try {
      const user = await parent.clientApi.account[type](args);
      user && parent.setUser(user);
      parent.setState(AppState.READY);
      return user;
    } catch (e) {
      parent.setState(AppState.ERROR);
      throw e;
    }
  },
});
