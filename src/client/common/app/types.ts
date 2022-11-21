/* eslint-disable import/no-cycle */

import * as T from '../api/types/types';
import { AppState } from '../constants';
import { HttpResponseError } from '../errors';
import { getApi } from '../api/client.api';
import { ClientApp } from './client.app';

export type IClientAppThis = ClientApp & {
  api: ReturnType<typeof getApi>;
  setState: (state: AppState) => void;
  setUser: (user: T.IUserResponse) => Promise<void>;
  setNet: (net: T.INetResponse) => void;
  setNets: (nets: IUserNetsResponse) => void;
  setError: (e: HttpResponseError) => void;
};

export type TLoginOrSignup =
  | ['login', T.ILoginParams]
  | ['signup', T.ISignupParams];

export interface IInitialState {
  net_id?: number;
}
