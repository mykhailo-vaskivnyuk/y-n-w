import { ITableNets } from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesNet {
  create:TQuery<[
    ['net_level', number],
    ['parent_net_id', number | null],
    ['first_net_id', number | null],
    ['count_of_nets', number],
  ], ITableNets>;
}
