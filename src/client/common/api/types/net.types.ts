import { ITableNets, ITableNetsData } from '../../../local/imports';

export type INetCreateParams  = Partial<Omit<ITableNets, 'net_id'>> &
  Pick<ITableNetsData, 'name'>;
export type INetCreateResponse = ITableNets & Pick<ITableNetsData, 'name'>;
