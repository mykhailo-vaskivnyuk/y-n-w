import { TQuery } from '../../../types/types';

export interface IQueriesNetMessage {
  create: TQuery<[
    ['user_id', number],
    ['net_id', number | null],
    ['net_view', string],
    ['from_node_id', number | null],
    ['message', string],
    ['date', string],
  ]>;
}

export const create = `
  INSERT INTO events (
    user_id,
    net_id,
    net_view,
    from_node_id,
    message,
    date
  )
  VALUES ($1, $2, $3, $4, $5, $6)
`;
