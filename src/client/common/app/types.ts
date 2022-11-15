/* eslint-disable import/no-cycle */
import { TNetCreateResponse } from '@api/api/client.api.types';
import { ILoginParams, ISignupParams, IUserResponse } from '../api/types';
import { AppState } from '../constants';
import { HttpResponseError } from '../errors';
import { getApi } from '../api/client.api';
import { ClientApp } from './client.app';

export type IClientAppThis = ClientApp & {
  state: AppState;
  clientApi: ReturnType<typeof getApi>;
  setState: (state: AppState) => void;
  setUser: (user: IUserResponse) => void;
  setNet: (net: TNetCreateResponse) => void;
  setError: (e: HttpResponseError) => void;
};

export type TLoginOrSignup =
  | ['login', ILoginParams]
  | ['signup', ISignupParams];
