/* eslint-disable import/no-cycle */
import * as T from '../api/types/types';
import { AppState } from '../constants';
import { HttpResponseError } from '../errors';
import { getApi } from '../api/client.api';
import { ClientApp } from './client.app';

export type IClientAppThis = ClientApp & {
  state: AppState;
  clientApi: ReturnType<typeof getApi>;
  setState: (state: AppState) => void;
  setUser: (user: T.IUserResponse) => void;
  setNet: (net: T.INetCreateResponse) => void;
  setError: (e: HttpResponseError) => void;
};

export type TLoginOrSignup =
  | ['login', T.ILoginParams]
  | ['signup', T.ISignupParams];
