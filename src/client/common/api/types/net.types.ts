import { ITableNets, ITableNetsData } from '../../../local/imports';
import { OmitNull } from '../../types';
import { IMemberResponse } from './member.types';

export type INetCreateParams  = Pick<ITableNetsData, 'name'>;
export type INetResponse = (ITableNets & INetCreateParams) | null;
export type INetsResponse = OmitNull<INetResponse>[];
export type INetReadParams = { net_id: number };
export type INetViewResponse = IMemberResponse[];
export const NET_VIEW_MAP = ['tree', 'circle'] as const;
export type NetViewKeys = typeof NET_VIEW_MAP[number];
