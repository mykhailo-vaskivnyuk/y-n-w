import {
  ITableMembers,
  ITableMembersToMembers,
  INet,
  ITableNets,
  ITableNetsData,
  ITableNodes,
  OuterJoin,
  ITableNetsGuests,
  ITableUsers,
} from '../../../local/imports';
import { IMemberResponse } from './member.types';

export type INetCreateParams = Pick<ITableNetsData, 'name'> & {
  node_id: number | null;
};

export type INetEnterParams = { net_id: number };

export type INetReadParams = { node_id: number };

export type INetUpdateParams = {
  goal: string;
  node_id: number;
};

export type INetResponse =
  | null
  | (Pick<ITableNets, 'net_id' | 'parent_net_id' | 'net_level'> &
      Pick<ITableNetsData, 'name' | 'goal' | 'net_link'> &
      Pick<ITableNodes, 'node_id' | 'parent_node_id'> & {
        total_count_of_members: number;
      });

export type INetsResponse = (ITableNets &
  Pick<ITableNetsData, 'name'> &
  Pick<ITableNodes, 'node_id' | 'parent_node_id'>)[];

export type INetViewResponse = IMemberResponse[];
export const NET_VIEW_MAP = ['net', 'tree', 'circle'] as const;
export type NetViewKeys = (typeof NET_VIEW_MAP)[number];
export type NetViewEnum = Exclude<NetViewKeys, 'net'>;

export type IUserNetDataResponse = Pick<
  ITableNodes,
  'node_id' | 'parent_node_id' | 'count_of_members'
> &
  Pick<ITableMembers, 'confirmed'> &
  OuterJoin<Pick<ITableMembersToMembers, 'vote'>> & { vote_count: number };

export type INetConnectByToken = {
  net_id: number;
  error?: 'already member or connected' | 'not parent net member';
} | null;

export type INetConnectByLink = {
  net_id: number;
  error?:
    | 'already waiting'
    | 'already member or connected'
    | 'not parent net member';
} | null;

export type IWaitCreateParams = {
  token: string;
  comment: string;
  test: boolean;
};

export type IWaitNets = Pick<INet, 'net_id' | 'name'>[];

export type INetWaiting = Pick<ITableUsers, 'name'> &
  Pick<ITableNetsGuests, 'comment'>;
export type INetWaitingResponse = INetWaiting[];
