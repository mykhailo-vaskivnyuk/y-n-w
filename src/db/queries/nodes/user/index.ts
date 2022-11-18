import { ITableNodes } from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesNodesUser {
  remove:TQuery<[
    ['user_id', number],
  ], ITableNodes>;
}

export const remove = `
  UPDATE nodes
  SET user_id = NULL, count_of_members = count_of_members - 1
  WHERE user_id = $1
  RETURNING *
`;
