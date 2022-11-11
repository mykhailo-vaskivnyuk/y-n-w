/* eslint-disable import/no-cycle */
import { ISignupParams, IUserResponse } from '../api/types';
import { TAccountLogin } from '../api/client.api.types';
import { AppState } from '../constants';
import { HttpResponseError } from '../errors';
import { getApi } from '../api/client.api';
import { ClientApp } from './client.app';

export type IClientAppThis = ClientApp & {
  state: AppState;
  clientApi: ReturnType<typeof getApi>;
  setState: (state: AppState) => void;
  setUser: (user: IUserResponse) => void;
  setError: (e: HttpResponseError) => void;
};

export type TLoginOrSignup = ['login', TAccountLogin] | ['signup', ISignupParams];
