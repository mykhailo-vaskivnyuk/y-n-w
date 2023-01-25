/* eslint-disable max-lines */
import { TQuery } from '../../types/types';
import { IMember, INodeWithUser } from '../../types/member.types';
import { ITableNetsData } from '../../db.types';
import { userInNetAndItsSubnets } from '../../utils';
import { IQueriesMemberData } from './data';
import { IQueriesMemberInvite } from './invite';

export interface IQueriesMember {
  remove: TQuery<[
    ['user_id', number],
    ['net_node_id', number | null],
  ]>;
  findInTree: TQuery<[
    ['user_node_id', number],
    ['member_node_id', number],
  ], INodeWithUser>;
  findInCircle: TQuery<[
    ['parent_node_id', number | null],
    ['member_node_id', number],
  ], INodeWithUser>;
  get: TQuery<[
    ['node_id', number],
  ], IMember & Pick<ITableNetsData, 'name'>>;
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
  removeVoted: TQuery<[
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
  invite: IQueriesMemberInvite;
}

export const remove = `
  DELETE FROM nets_users_data
  WHERE user_id = $1 AND net_node_id IN (
    SELECT nets_users_data.net_node_id
    FROM nets_users_data
    INNER JOIN nets ON
      nets.net_node_id = nets_users_data.net_node_id
    WHERE ${userInNetAndItsSubnets()}
  )
`;

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

export const get = `
  SELECT
    nodes.*,
    nets_users_data.user_id,
    nets_users_data.confirmed,
    nets_data.name
  FROM nodes
  INNER JOIN nets_users_data ON
    nets_users_data.node_id = nodes.node_id
  INNER JOIN nets_data ON
    nets_users_data.net_node_id = nets_data.net_node_id
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
  INSERT INTO nets_users_data_tmp
  SELECT * FROM nets_users_data
  WHERE node_id IN ($1, $2)
`;

export const removeVoted = `
  DELETE FROM nets_users_data
  WHERE node_id IN ($1, $2)
`;

export const change = `
  UPDATE nets_users_data_tmp
  SET
    node_id = CASE WHEN user_id = $3 THEN +$2 ELSE +$1 END
  WHERE user_id IN ($3, $4) AND net_node_id = $5
`;

export const moveFromTmp = `
  INSERT INTO nets_users_data 
  SELECT * FROM nets_users_data_tmp
  WHERE node_id IN ($1, $2)
`;

export const removeFromTmp = `
  DELETE FROM nets_users_data_tmp
  WHERE node_id IN ($1, $2)
`;
