import { ITableNodesInvites, ITableUsers } from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesNetTree {
  get: TQuery<[
    ['node_id', number],
  ], ITableUsers & ITableNodesInvites>;
}

export const get = `
  SELECT 
    nodes.node_id,
    users.email as name,
    nodes_invites.member_name,
    nodes_invites.token
  FROM nodes
  LEFT JOIN users
    ON nodes.user_id = users.user_id
  LEFT JOIN nodes_invites
    ON nodes_invites.node_id = nodes.node_id
  WHERE 
    nodes.parent_node_id = $1
  ORDER BY nodes.node_position
`;
