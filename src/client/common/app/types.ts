/* eslint-disable import/no-cycle */
import * as T from '../api/types/types';
import { INetSimpleResponse } from '../api/types/types';
import { AppState } from '../constants';
import { HttpResponseError } from '../errors';
import { getApi } from '../api/client.api';
import { ClientApp } from './client.app';

export type IClientAppThis = ClientApp & {
  api: ReturnType<typeof getApi>;
  setState: (state: AppState) => void;
  setUser: (user: T.IUserResponse) => Promise<void>;
  setNet: (net: T.INetResponse) => void;
  setNets: (nets: IUserNets) => void;
  setError: (e: HttpResponseError) => void;
};

export interface IUserNets {
  parentNets: INetSimpleResponse;
  siblingNets: INetSimpleResponse;
  childNets: INetSimpleResponse;
}

export type TLoginOrSignup =
  | ['login', T.ILoginParams]
  | ['signup', T.ISignupParams];

export interface IInitialState {
  net_id?: number;
}
