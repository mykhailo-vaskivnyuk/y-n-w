/* eslint-disable max-lines */
import { TQuery } from '../../types/types';
import { IMember } from '../../../domain/types/member.types';
import { ITableMembers } from '../../../domain/types/db.types';
import { IQueriesMemberData } from './data';
import { IQueriesMemberInvite } from './invite';
import { IQueriesMemberFind } from './find';

export interface IQueriesMember {
  create: TQuery<[
    ['node_id', number],
    ['user_id', number],
  ], ITableMembers>;
  connect: TQuery<[
    ['node_id', number],
    ['user_id', number],
  ], ITableMembers>;
  confirm: TQuery<[
    ['member_id', number],
  ]>;
  remove: TQuery<[
    ['user_id', number],
    ['net_id', number | null],
  ]>;
  get: TQuery<[
    ['node_id', number],
  ], IMember>;
  getConnected: TQuery<[
    ['parent_node_id', number],
  ], Pick<ITableMembers, 'user_id'>>;
  updateDate: TQuery<[
    ['member_id', number],
  ]>;
  replace: TQuery<[
    ['node_id', number],
    ['parent_node_id', number],
    ['user_id', number],
    ['parent_user_id', number],
  ]>;
  data: IQueriesMemberData;
  invite: IQueriesMemberInvite;
  find: IQueriesMemberFind;
}

export const create = `
  INSERT INTO members (
    member_id, user_id, confirmed
  )
  VALUES ($1, $2, true)
  RETURNING *
`;

export const connect = `
  INSERT INTO members (
    member_id, user_id
  )
  VALUES ($1, $2)
  RETURNING *
`;

export const confirm = `
  UPDATE members
  SET confirmed = true
  WHERE member_id = $1
`;

export const remove = `
  DELETE FROM members
  WHERE member_id IN (
    SELECT members.member_id
    FROM members
    INNER JOIN nodes ON
      nodes.node_id = members.member_id
    WHERE
      members.user_id = $1 AND
      nodes.net_id = $2
  )
`;

export const get = `
  SELECT
    nodes.*,
    nodes.net_id::int,
    members.*,
    nodes.node_id::int,
    nodes.parent_node_id::int,
    members.user_id::int
  FROM nodes
  INNER JOIN members ON
    members.member_id = nodes.node_id
  WHERE nodes.node_id = $1
`;

export const getConnected = `
  SELECT members.user_id::int
  FROM nodes
  INNER JOIN members ON
    members.member_id = nodes.node_id
  WHERE
    nodes.parent_node_id = $1 AND
    members.confirmed = false
`;

export const updateDate = `
  UPDATE members
  SET active_date = now() at time zone 'UTC'
  WHERE member_id = $1
`;

export const replace = `
  UPDATE members
  SET user_id =
    CASE WHEN user_id = $3
      THEN $4
      ELSE $3
    END
  WHERE member_id IN ($1, $2)
`;
