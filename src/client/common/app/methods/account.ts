/* eslint-disable import/no-cycle */
import {
  IConfirmParams, ISignupParams, IUserResponse,
} from '../../api/types/types';
import { AppState } from '../../constants';
import { IClientAppThis, TLoginOrSignup } from '../types';

export const getAccountMethods = (parent: IClientAppThis) => ({
  async loginOrSignup(...[type, args]: TLoginOrSignup) {
    parent.setState(AppState.LOADING);
    try {
      const user = await parent.api.account[type](args as any);
      user && await parent.setUser(user);
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
      const success = await parent.api.account[type]();
      success && await parent.setUser(null);
      parent.setState(AppState.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  },

  async overmail(args: ISignupParams) {
    parent.setState(AppState.LOADING);
    try {
      const success = await parent.api.account.overmail(args);
      parent.setState(AppState.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async loginOverLink(
    type: 'confirm' | 'restore', args: IConfirmParams,
  ): Promise<IUserResponse> {
    parent.setState(AppState.LOADING);
    try {
      const user = await parent.api.account[type](args);
      user && await parent.setUser(user);
      parent.setState(AppState.READY);
      return user;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  },
});
