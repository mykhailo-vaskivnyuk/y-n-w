/* eslint-disable import/no-cycle */
import * as T from '../server/types/types';
// import { ITableBoardMessages } from '../../local/imports';
import { AppStatus } from './constants';
import { MemberStatusKeys } from '../server/constants';
import { HttpResponseError } from './connection/errors';
import { ClientApp } from './app';

export type IClientAppThis = Pick<ClientApp,
  | 'account'
  | 'userNets'
  | 'net'
  | 'member'
  | 'chat'
  | 'changes'
  | 'getState'
  | 'emit'
> & {
  api: T.OmitNull<ClientApp['api']>;
  setStatus: (status: AppStatus) => void;
  setError: (e: HttpResponseError) => void;
  setUser: (user: T.IUserResponse, readChanges?: boolean) => Promise<void>;
  setMemberPosition: (memberPosition?: number) => void;
  setMember: (memberData?: IMember) => void;
  // setUserChatId: (chatId:  number) => void;
  // setNetChatIds: (netChatIds: TNetChatIdsMap) => void;
  // setMessage: (message: T.OmitNull<T.IChatResponseMessage>) => void;
  // setAllMessages: (chatId: number, messages: T.IChatMessage[]) => void;
  // setBoardMessages: (messages: ITableBoardMessages[]) => void;
  // setChanges: (changes: T.IEvents) => void;
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
