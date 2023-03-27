import {
  ITableNets, ITableNetsData, ITableNodes
} from '../../../local/imports';
import { IMemberResponse } from './member.types';

export type INetCreateParams  =
  Pick<ITableNetsData, 'name'> &
  { node_id: number | null };

export type INetEnterParams = { net_id: number };

export type INetReadParams = { node_id: number };

export type INetUpdateParams  = {
  goal: string;
  node_id: number | null;
};

export type INetResponse = null | (
  ITableNets &
  Pick<ITableNetsData, 'name' | 'goal'> &
  Pick<ITableNodes, 'node_id' | 'parent_node_id' | 'count_of_members'>
);

export type INetsResponse = (
  ITableNets &
  Pick<ITableNetsData, 'name'> &
  Pick<ITableNodes, 'node_id' | 'parent_node_id'>)[];

export type INetViewResponse = IMemberResponse[];
export const NET_VIEW_MAP = ['net', 'tree', 'circle'] as const;
export type NetViewKeys = typeof NET_VIEW_MAP[number];
export type NetViewEnum = Exclude<NetViewKeys, 'net'>;
