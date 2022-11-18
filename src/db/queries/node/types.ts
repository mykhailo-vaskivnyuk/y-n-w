import { ITableNodes } from '../../db.types';
import { TQuery } from '../../types';
import { IQueriesNodeUser } from './user';

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
  removeTree: TQuery<[
    ['parent_node_id', number],
  ]>;
  user: IQueriesNodeUser;
}