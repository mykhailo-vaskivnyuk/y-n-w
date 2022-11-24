/* eslint-disable import/no-cycle */
import * as T from '../api/types/types';
import { INetsResponse } from '../api/types/types';
import { AppState } from '../constants';
import { HttpResponseError } from '../errors';
import { getApi } from '../api/client.api';
import { ClientApp } from './client.app';

export type IClientAppThis = ClientApp & {
  api: ReturnType<typeof getApi>;
  setState: (state: AppState) => void;
  setUser: (user: T.IUserResponse) => Promise<void>;
  setNet: (net: T.INetResponse) => void;
  setAllNets: (nets: INetsResponse) => void;
  setNets: (nets: INets) => void;
  setError: (e: HttpResponseError) => void;
};

export interface INets {
  parentNets: INetsResponse;
  siblingNets: INetsResponse;
  childNets: INetsResponse;
}

export type TLoginOrSignup =
  | ['login', T.ILoginParams]
  | ['signup', T.ISignupParams];

export const INITIAL_NETS = {
  parentNets: [],
  siblingNets: [],
  childNets: [],
} as INets;
