import { TQuery } from '../../../types/types';

export interface IQueriesNetMessage {
  create: TQuery<[
    ['user_id', number],
    ['user_node_id', number | null],
    ['net_view', string],
    ['member_node_id', number | null],
    ['message', string],
    ['date', string],
  ]>;
}

export const create = `
  INSERT INTO users_messages (
    user_id,
    user_node_id,
    net_view,
    member_node_id,
    message,
    date
  )
  VALUES ($1, $2, $3, $4, $5, $6)
`;
