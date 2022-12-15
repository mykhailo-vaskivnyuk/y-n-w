/* eslint-disable import/no-cycle */
import * as T from '../api/types/types';
import { INetViewResponse, INetsResponse } from '../api/types/types';
import { AppStatus } from '../constants';
import { HttpResponseError } from '../errors';
import { getApi } from '../api/client.api';
import { ClientApp } from './client.app';

export type IClientAppThis = ClientApp & {
  api: ReturnType<typeof getApi>;
  setStatus: (status: AppStatus) => void;
  setUser: (user: T.IUserResponse) => Promise<void>;
  setNet: (net: T.INetResponse) => void;
  setAllNets: (nets: INetsResponse) => void;
  setNets: (nets: INets) => void;
  setCircle: (circle: INetViewResponse) => void;
  setTree: (tree: INetViewResponse) => void;
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
