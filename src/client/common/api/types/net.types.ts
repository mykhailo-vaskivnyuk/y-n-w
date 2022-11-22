import { OmitNull } from '../../types';
import { ITableNets, ITableNetsData } from '../../../local/imports';

export type INetCreateParams  = Pick<ITableNetsData, 'name'>;
export type INetResponse = ITableNets & INetCreateParams | null;
export type INetReadParams = { net_id: number | null };
export type INetSimpleResponse =
  Pick<OmitNull<INetResponse>, 'net_id' | 'name'>[];
