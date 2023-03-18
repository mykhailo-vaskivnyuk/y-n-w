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

export interface INetThis {
  onNetChanged: () => void,
  onMemberChanged: () => void,
};

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
