import { ITableUsers } from '../../../domain/types/db.types';
import { TQuery } from '../../types/types';

export interface IQueriesNetUsers {
  toNotify: TQuery<[
    ['net_id', number],
  ], ITableUsers>;
}

export const toNotify = `
  SELECT users.*, users.user_id::int
  FROM nodes
  INNER JOIN members ON
    members.member_id = nodes.node_id
  INNER JOIN users ON
    users.user_id = members.user_id
  LEFT JOIN users_events ON
    users_events.user_id = users.user_id
  WHERE
    nodes.net_id = $1 AND
    members.confirmed = true AND
    users.chat_id NOTNULL AND
    users_events.notification_date ISNULL
`;
