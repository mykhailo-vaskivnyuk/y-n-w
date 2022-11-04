/* eslint-disable import/no-cycle */
import {
  TAccountConfirm,
  TAccountLogin,
  TAccountOvermail,
  TAccountSignup,
} from '../api/client.api.types';
import { IUserResponse } from '../api/types';
import { AppState } from '../constants';
import { ClientAppThis } from './client.app';

type TLoginOrSignup = ['login', TAccountLogin] | ['signup', TAccountSignup];

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

  async overmail(args: TAccountOvermail) {
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

  async loginOverLink(type: 'confirm' | 'restore', args: TAccountConfirm): Promise<IUserResponse> {
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
