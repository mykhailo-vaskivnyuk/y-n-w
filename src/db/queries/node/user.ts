import { TQuery } from '../../types';

export interface IQueriesNodeUser {
  connect: TQuery<[
    ['node_id', number],
    ['user_id', number],
  ]>;
}

export const connect = `
  UPDATE nodes
  SET count_of_members = 1, user_id = $2
  WHERE node_id = $1
`;
