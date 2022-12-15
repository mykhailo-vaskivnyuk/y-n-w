import { ITableNodesInvites, ITableUsers } from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesNetCircle {
  get: TQuery<[
    ['node_id', number],
  ], ITableUsers & ITableNodesInvites>;
}

export const get = `
  SELECT 
    nodes.node_id,
    users.email AS name,
    nodes_invites.member_name,
    nodes_invites.token
  FROM nodes
  LEFT JOIN users
    ON nodes.user_id = users.user_id
  LEFT JOIN nodes_invites
    ON nodes_invites.node_id = nodes.node_id
  WHERE (
      nodes.node_id <> $1 AND
      nodes.parent_node_id = (
        SELECT parent_node_id FROM nodes WHERE node_id = $1
      )
    ) OR 
    nodes.node_id = (SELECT parent_node_id FROM nodes WHERE node_id = $1)
  ORDER BY nodes.node_position
`;
