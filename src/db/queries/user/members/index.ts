/* eslint-disable max-lines */
import { TQuery } from '../../../types';

export interface IQueriesUserMembers {
  removeInvites: TQuery<[
    ['user_id', number],
    ['net_node_id', number | null],
  ]>;
}

export const removeInvites = `
  DELETE FROM nodes_invites
  WHERE nodes_invites.node_id IN (
    SELECT node_id
    FROM nodes
    INNER JOIN nets_users_data ON
      nodes.parent_node_id = nets_users_data.node_id 
    WHERE
      nets_users_data.user_id = $1 AND ((
      ($2 + 1) NOTNULL AND
      nets.first_net_id = $2 AND
      nets.net_level >= (SELECT net_level FROM nets WHERE net_node_id = $2)) OR
      ($2 + 1) ISNULL
    )
  )
`;
