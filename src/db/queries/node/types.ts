import { ITableNodes } from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesNode {
  create:TQuery<[
    ['parent_node_id', number | null],
    ['first_node_id', number | null],
    ['node_date', string],
    ['user_id', number],
  ], ITableNodes>;
}
