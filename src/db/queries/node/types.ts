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
  removeUser:TQuery<[
    ['user_id', number],
  ]>;
}
