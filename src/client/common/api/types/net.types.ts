import { ITableNets, ITableNetsData } from '../../../local/imports';

export type INetCreateParams  = Pick<ITableNetsData, 'name'>;
export type INetCreateResponse = ITableNets & INetCreateParams | null;
