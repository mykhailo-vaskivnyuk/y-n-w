import { IMemberResponse } from '../../../client/common/api/types/types';
import { TQuery } from '../../types';

export interface IQueriesNetCircle {
  get: TQuery<[
    ['node_id', number],
  ], IMemberResponse>;
}

export const get = `
  SELECT 
    nodes.node_id,
    CASE
      WHEN users_nodes_invites.token ISNULL THEN users.email
      ELSE null
    END AS name
  FROM nodes
  LEFT JOIN users
    ON nodes.user_id = users.user_id
  LEFT JOIN users_nodes_invites
    ON users_nodes_invites.node_id = nodes.node_id
  WHERE (
      nodes.node_id <> $1 AND
      nodes.parent_node_id = (
        SELECT parent_node_id FROM nodes WHERE node_id = $1
      )
    ) OR 
    nodes.node_id = (SELECT parent_node_id FROM nodes WHERE node_id = $1)
  ORDER BY nodes.node_level, nodes.node_position
`;
