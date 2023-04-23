/* eslint-disable max-lines */
import { TQuery } from '../../types/types';
import { IMember, INodeWithUser } from '../../types/member.types';
import { ITableNetsData } from '../../types/db.tables.types';
import { userInNetAndItsSubnets } from '../../utils';
import { IQueriesMemberData } from './data';
import { IQueriesMemberInvite } from './invite';
import { IQueriesMemberFind } from './find';

export interface IQueriesMember {
  remove: TQuery<[
    ['user_id', number],
    ['net_id', number | null],
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
  data: IQueriesMemberData;
  invite: IQueriesMemberInvite;
  find: IQueriesMemberFind;
}

export const remove = `
  DELETE FROM members
  WHERE user_id = $1 AND net_id IN (
    SELECT members.net_id
    FROM members
    INNER JOIN nets ON
      nets.net_id = members.net_id
    WHERE ${userInNetAndItsSubnets()}
  )
`;

export const findInTree = `
  SELECT
    members_invites.*,
    nodes.*,
    members.user_id, members.confirmed
  FROM nodes
  LEFT JOIN members ON
    members.node_id = nodes.node_id
  LEFT JOIN members_invites ON
    members_invites.member_node_id = nodes.node_id
  WHERE nodes.parent_node_id = $1 AND nodes.node_id = $2
`;

export const findInCircle = `
  SELECT
    members_invites.*,
    nodes.*,
    members.user_id, members.confirmed
  FROM nodes
  LEFT JOIN members ON
    members.node_id = nodes.node_id
  LEFT JOIN members_invites ON
    members_invites.member_node_id = nodes.node_id
  WHERE
    nodes.node_id = $2 AND (
      nodes.parent_node_id = $1 OR
      nodes.node_id = $1
    )
`;

export const get = `
  SELECT
    nodes.*,
    members.user_id::int,
    members.confirmed,
    nets_data.name
  FROM nodes
  INNER JOIN nets_data ON
    nodes.net_id = nets_data.net_id
  LEFT JOIN members ON
    members.node_id = nodes.node_id
  WHERE nodes.node_id = $1
`;

export const getConnected = `
  SELECT
    members.user_id
  FROM nodes
  INNER JOIN members ON
    members.node_id = nodes.node_id
  WHERE
    nodes.parent_node_id = $1 AND
    members.confirmed = false
`;

export const changeNode = `
  UPDATE members
  SET node_id = $2
  WHERE node_id = $1
`;
