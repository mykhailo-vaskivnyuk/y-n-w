/* eslint-disable import/no-cycle */
import * as T from '../server/types/types';
import { AppStatus } from './constants';
import { MemberStatusKeys } from '../server/constants';
import { HttpResponseError } from './connection/errors';
import { IClientApi } from '../server/client.api';
import { EventEmitter } from './event.emitter';
import { ClientApp } from './app';

export type IClientAppThis =
  EventEmitter &
  Pick<ClientApp, 'getState'> & {
    api: IClientApi;
    setStatus: (status: AppStatus) => void;
    setError: (e: HttpResponseError) => void;
  };

// export type IClientAppThis = Pick<ClientApp,
//   | 'account'
//   | 'userNets'
//   | 'net'
//   | 'chat'
//   | 'userEvents'
//   | 'getState'
//   | 'emit'
// > & {
//   api: T.OmitNull<ClientApp['api']>;
//   setStatus: (status: AppStatus) => void;
//   setError: (e: HttpResponseError) => void;
//   setUser: (user: T.IUserResponse, readChanges?: boolean) => Promise<void>;
//   setNet: (methodName?: keyof Net) => void;
//   setEvents: (events: IEvents) => void;
// };

export interface INets {
  parentNets: T.INetsResponse;
  siblingNets: T.INetsResponse;
  childNets: T.INetsResponse;
}

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

// export type INetThis = {
//   netChanged: (nodeId: number) => Promise<void>;
//   memberChanged: (nodeId: number) => Promise<void>;
// };
