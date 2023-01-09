/* eslint-disable max-lines */
import { DbRecordOrNull } from '../../../client/common/types';
import {
  ITableNetsUsersData, ITableNodes, ITableUsersNodesInvites,
} from '../../db.types';
import { TQuery } from '../../types';
import { IQueriesMemberData } from './data';

export interface IQueriesMember {
  findInTree: TQuery<[
    ['user_node_id', number],
    ['member_node_id', number],
  ],
    ITableNodes &
    DbRecordOrNull<Pick<ITableUsersNodesInvites, 'token'>> &
    DbRecordOrNull<Pick<ITableNetsUsersData, 'user_id' | 'confirmed'>>
  >;
  findInCircle: TQuery<[
    ['parent_node_id', number | null],
    ['member_node_id', number],
  ],
  ITableNodes &
  DbRecordOrNull<Pick<ITableUsersNodesInvites, 'token'>> &
  DbRecordOrNull<Pick<ITableNetsUsersData, 'user_id' | 'confirmed'>>
>;
  inviteCreate: TQuery<[
    ['parent_node_id', number],
    ['node_id', number],
    ['member_name', string],
    ['token', string],
  ]>;
  inviteRemove: TQuery<[
    ['node_id', number],
  ]>;
  inviteConfirm: TQuery<[
    ['node_id', number],
  ]>;
  get: TQuery<[
    ['node_id', number],
  ],
    { user_id: number } &
    ITableNodes
  >;
  getConnected: TQuery<[
    ['parent_node_id', number],
  ], {
    user_id: number;
    node_id: number;
  }>;
  moveToTmp: TQuery<[
    ['node_id', number],
    ['parent_node_id', number],
  ]>;
  remove: TQuery<[
    ['node_id', number],
    ['parent_node_id', number],
  ]>;
  change: TQuery<[
    ['node_id', number],
    ['parent_node_id', number],
    ['user_id', number],
    ['parent_user_id', number | null],
    ['net_node_id', number],
  ]>;
  moveFromTmp: TQuery<[
    ['node_id', number],
    ['parent_node_id', number],
  ]>;
  removeFromTmp: TQuery<[
    ['node_id', number],
    ['parent_node_id', number],
  ]>;
  data: IQueriesMemberData;
}

export const findInTree = `
  SELECT
    nodes_invites.*,
    nodes.*,
    nets_users_data.user_id, nets_users_data.confirmed
  FROM nodes
  LEFT JOIN nets_users_data ON
    nets_users_data.node_id = nodes.node_id
  LEFT JOIN nodes_invites ON
    nodes_invites.node_id = nodes.node_id
  WHERE nodes.parent_node_id = $1 AND nodes.node_id = $2
`;

export const findInCircle = `
  SELECT
    nodes_invites.*,
    nodes.*,
    nets_users_data.user_id, nets_users_data.confirmed
  FROM nodes
  LEFT JOIN nets_users_data ON
    nets_users_data.node_id = nodes.node_id
  LEFT JOIN nodes_invites ON
    nodes_invites.node_id = nodes.node_id
  WHERE
    nodes.node_id = $2 AND (
      nodes.parent_node_id = $1 OR
      nodes.node_id = $1
    )
`;

export const inviteCreate = `
  INSERT INTO nodes_invites (
    parent_node_id, node_id, member_name, token
  )
  VALUES ($1, $2, $3, $4)
`;

export const inviteRemove = `
  DELETE FROM nodes_invites
  WHERE node_id = $1
`;

export const inviteConfirm = `
  UPDATE nets_users_data
  SET confirmed = true
  WHERE node_id = $1
`;

export const get = `
  SELECT
    nets_users_data.user_id,
    nodes.node_id,
    nodes.parent_node_id,
    nodes.net_node_id
  FROM nodes
  INNER JOIN nets_users_data ON
    nets_users_data.node_id = nodes.node_id
  WHERE nodes.node_id = $1
`;

export const getConnected = `
  SELECT
    nets_users_data.user_id
  FROM nodes
  INNER JOIN nets_users_data ON
    nets_users_data.node_id = nodes.node_id
  WHERE
    nodes.parent_node_id = $1 AND
    nets_users_data.confirmed = false
`;

export const moveToTmp = `
  INSERT INTO nets_users_data_tmp *
  SELECT FROM nets_users_data
  WHERE node_id IN ($1, $2)
`;

export const remove = `
  DELETE FROM nets_users_data
  WHERE node_id IN ($1, $2)
`;

export const change = `
  UPDATE nets_users_data_tmp
  SET node_id = CASE WHEN user_id = $3 THEN $2 ELSE $1 END
  WHERE usere_id IN ($1, $2) AND net_node_id = $5
`;

export const moveFromTmp = `
  INSERT INTO nets_users_data 
  SELECT FROM nets_users_data_tmp
  WHERE node_id IN ($1, $2)
`;

export const removeFromTmp = `
  DELETE FROM nets_users_data_tmp
  WHERE node_id IN ($1, $2)
`;
