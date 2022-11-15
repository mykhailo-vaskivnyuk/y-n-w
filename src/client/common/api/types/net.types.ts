import { ITableNets } from '../../../local/imports';

export type INetCreateParams  = Partial<Omit<ITableNets, 'net_id'>>;
export type INetCreateResponse = ITableNets;
