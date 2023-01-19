/* eslint-disable import/no-cycle */
import * as T from '../api/types/types';
import { OmitNull } from '../types';
import { AppStatus, MemberStatusKeys } from '../constants';
import { HttpResponseError } from '../errors';
import { getApi } from '../api/client.api';
import { ClientApp } from './client.app';

export type IClientAppThis = ClientApp & {
  api: ReturnType<typeof getApi>;
  setStatus: (status: AppStatus) => void;
  setError: (e: HttpResponseError) => void;
  setUser: (user: T.IUserResponse) => Promise<void>;
  setUserNetData: (userNetData: T.IUserNetDataResponse) => void;
  setNet: (net: T.INetResponse) => Promise<void>;
  setAllNets: (nets: T.INetsResponse) => void;
  setNets: (nets: INets) => void;
  setCircle: (circle: T.INetViewResponse) => void;
  setTree: (tree: T.INetViewResponse) => void;
  setNetView: (netView?: T.NetViewKeys) => void;
  setMemberPosition: (memberPosition?: number) => void;
  setMessage: (message: OmitNull<T.IChatResponseMessage>) => void;
  setAllMessages: (chatId: number, messages: T.IChatMessage[]) => void;
};

export interface INets {
  parentNets: T.INetsResponse;
  siblingNets: T.INetsResponse;
  childNets: T.INetsResponse;
}

export type TLoginOrSignup =
  | ['login', T.ILoginParams]
  | ['signup', T.ISignupParams];

export const INITIAL_NETS = {
  parentNets: [],
  siblingNets: [],
  childNets: [],
} as INets;

export type IMember = Omit<T.IMemberResponse, 'member_name'> & {
  member_name: string;
  memberStatus: MemberStatusKeys;
};
