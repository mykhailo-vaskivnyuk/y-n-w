import { ITableNodes } from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesNode {
  createInitial:TQuery<[
    ['node_date', string],
    ['user_id', number],
  ], ITableNodes>;
  create:TQuery<[
    ['node_level', number],
    ['node_position', number],
    ['parent_node_id', number],
    ['first_node_id', number],
    ['node_date', string],
  ]>;
  remove: TQuery<[
    ['node_id', number],
  ]>;
  updateCountOfMembers:TQuery<[
    ['node_id', number],
    ['addCount', number]
  ], ITableNodes>;
  removeUserFromAll:TQuery<[
    ['user_id', number],
  ], ITableNodes>;
  removeUserFromOne:TQuery<[
    ['node_id', number],
  ], ITableNodes>;
  removeTree: TQuery<[
    ['parent_node_id', number],
  ]>;
  findByUserNet: TQuery<[
    ['user_id', number],
    ['net_id', number],
  ], ITableNodes>;
}
