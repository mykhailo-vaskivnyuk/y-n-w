import {
  ITableNets, ITableNetsData, ITableNetsUsersData,
} from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesNet {
  create:TQuery<[
    ['node_id', number],
  ], ITableNets>;
  createData:TQuery<[
    ['net_id', number],
    ['name', string],
  ], ITableNetsData>;
  createUserData:TQuery<[
    ['net_id', number],
    ['user_id', number],
  ], ITableNetsUsersData>;
  readUserData:TQuery<[
    ['user_id', number],
    ['net_id', number],
  ], ITableNets & ITableNetsData>;
}
