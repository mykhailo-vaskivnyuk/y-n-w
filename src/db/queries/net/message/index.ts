import { NetEventKeys } from '../../../../client/common/server/types/types';
import { TQuery } from '../../../types/types';

export interface IQueriesNetMessage {
  create: TQuery<[
    ['user_id', number],
    ['member_id', number | null],
    ['net_view', string],
    ['from_node_id', number | null],
    ['event_type', NetEventKeys],
    ['message', string],
    ['date', string],
  ]>;
}

export const create = `
  INSERT INTO events (
    user_id,
    member_id,
    net_view,
    from_node_id,
    event_type,
    message,
    date
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7)
`;
