import {
  ITableNets, ITableNodes, ITableUsersNodesInvites,
} from '../../db.types';
import { TQuery } from '../../types';
import { IQueriesMemberData } from './data';

export interface IQueriesMember {
  findInTree: TQuery<[
    ['user_node_id', number],
    ['member_node_id', number],
  ],
    ITableUsersNodesInvites &
    ITableNodes &
    ITableNets>;
  findInCircle: TQuery<[
    ['parent_node_id', number | null],
    ['member_node_id', number],
  ],
    ITableUsersNodesInvites &
    ITableNodes &
    ITableNets>;
  inviteCreate: TQuery<[
    ['node_id', number],
    ['user_id', number],
    ['member_name', string],
    ['token', string],
  ]>;
  inviteRemove: TQuery<[
    ['node_id', number],
  ]>;
  get: TQuery<[
    ['parent_node_id', number],
  ], {
    user_id: number,
    parent_node_id: number | null,
    net_id: number,
  }>;
  change: TQuery<[
    ['user_id', number],
    ['node_id', number],
  ]>;
  data: IQueriesMemberData;
}

export const findInTree = `
  SELECT users_nodes_invites.*, nodes.*, nets.net_id
  FROM nodes
  JOIN nets ON
    nets.node_id = nodes.first_node_id
  LEFT JOIN users_nodes_invites ON
    users_nodes_invites.node_id = nodes.node_id
  WHERE nodes.parent_node_id = $1 AND nodes.node_id = $2
`;

export const findInCircle = `
  SELECT users_nodes_invites.*, nodes.*, nets.net_id
  FROM nodes
  JOIN nets ON
    nets.node_id = nodes.first_node_id
  LEFT JOIN users_nodes_invites ON
    users_nodes_invites.node_id = nodes.node_id
  WHERE
    nodes.node_id = $2 AND (
      nodes.parent_node_id = $1 OR
      nodes.node_id = $1
    )
`;

export const inviteCreate = `
  INSERT INTO users_nodes_invites (
    node_id,
    user_id,
    member_name,
    token
  )
  VALUES ($1, $2, $3, $4)
`;

export const inviteRemove = `
  DELETE FROM users_nodes_invites
  WHERE node_id = $1
`;

export const get = `
  SELECT nodes.user_id, nodes.parent_node_id, nets.net_id
  INNER JOIN nets ON
    nets.node_id = nodes.first_node_id
  WHERE
    nodes.user_id NOTNULL AND
    nodes.node_id = $1
`;

export const change = `
  UPDATE nodes
  SET nodes.user_id = $1
  WHERE nodes.node_id = $2
`;
