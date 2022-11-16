import {
  ITableNets, ITableNetsData, ITableNetsUsersData,
} from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesNet {
  create:TQuery<[
    ['net_level', number],
    ['parent_net_id', number | null],
    ['first_net_id', number | null],
    ['count_of_nets', number],
  ], ITableNets>;
  createData:TQuery<[
    ['net_id', number],
    ['name', string],
  ], ITableNetsData>;
  createUserData:TQuery<[
    ['net_id', number],
    ['user_id', number],
  ], ITableNetsUsersData>;
}
