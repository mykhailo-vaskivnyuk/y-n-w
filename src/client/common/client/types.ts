/* eslint-disable import/no-cycle */
import * as T from '../server/types/types';
import { ITableBoardMessages } from '../../local/imports';
import { AppStatus } from './constants';
import { MemberStatusKeys } from '../server/constants';
import { HttpResponseError } from './connection/errors';
import { getApi } from '../server/client.api';
import { ClientApp } from './app';

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
  setNetView: (netView?: T.NetViewEnum) => void;
  setMemberPosition: (memberPosition?: number) => void;
  setMember: (memberData?: IMember) => void;
  setUserChatId: (chatId:  number) => void;
  setNetChatIds: (netChatIds: TNetChatIdsMap) => void;
  setMessage: (message: T.OmitNull<T.IChatResponseMessage>) => void;
  setAllMessages: (chatId: number, messages: T.IChatMessage[]) => void;
  setBoardMessages: (messages: ITableBoardMessages[]) => void;
  setChanges: (changes: T.IEvents) => void;
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

export type TNetChatIdsMap = Map<number, T.INetChatIds>;
