/* eslint-disable import/no-cycle */
import {
  IConfirmParams, ISignupParams, IUserResponse,
} from '../../api/types/types';
import { AppStatus } from '../../constants';
import { IClientAppThis, TLoginOrSignup } from '../types';

export const getAccountMethods = (parent: IClientAppThis) => ({
  async loginOrSignup(...[type, args]: TLoginOrSignup) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const user = await parent.api.account[type](args as any);
      user && await parent.setUser(user);
      parent.setStatus(AppStatus.READY);
      return user;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  },

  async logoutOrRemove(type: 'logout' | 'remove') {
    parent.setStatus(AppStatus.LOADING);
    try {
      const success = await parent.api.account[type]();
      success && await parent.setUser(null);
      parent.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  },

  async overmail(args: ISignupParams) {
    parent.setStatus(AppStatus.LOADING);
    try {
      const success = await parent.api.account.overmail(args);
      parent.setStatus(AppStatus.READY);
      return success;
    } catch (e: any) {
      parent.setError(e);
    }
  },

  async loginOverLink(
    type: 'confirm' | 'restore', args: IConfirmParams,
  ): Promise<IUserResponse> {
    parent.setStatus(AppStatus.LOADING);
    try {
      const user = await parent.api.account[type](args);
      user && await parent.setUser(user);
      parent.setStatus(AppStatus.READY);
      return user;
    } catch (e: any) {
      parent.setError(e);
      throw e;
    }
  },
});
