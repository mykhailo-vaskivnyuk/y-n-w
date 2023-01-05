import {
  ITableNets, ITableNetsData,
} from '../../../local/imports';
import { OmitNull } from '../../types';
import { IMemberResponse } from './member.types';

export type INetCreateParams  =
  Pick<ITableNetsData, 'name'> & { net_node_id: number | null };
export type INetResponse = (ITableNets & Pick<ITableNetsData, 'name'>) | null;
export type INetsResponse = OmitNull<INetResponse>[];
export type INetReadParams = { net_node_id: number };
export type INetViewResponse = IMemberResponse[];
export const NET_VIEW_MAP = ['tree', 'circle'] as const;
export type NetViewKeys = typeof NET_VIEW_MAP[number];
