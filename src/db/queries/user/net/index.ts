/* eslint-disable max-lines */
import {
  INetResponse, IUserNetDataResponse, OmitNull,
} from '../../../../client/common/server/types/types';
import { TQuery } from '../../../types/types';
import { IUserNetData } from '../../../types/member.types';
import { userInNetAndItsSubnets } from '../../../utils';

export interface IQueriesUserNet {
  find: TQuery<[
    ['user_id', number],
    ['node_id', number],
  ], IUserNetData>
  read: TQuery<[
    ['user_id', number],
    ['net_id', number],
  ], OmitNull<INetResponse>>;
  getNetAndSubnets: TQuery<[
    ['user_id', number],
    ['net_id', number | null],
  ], IUserNetData>;
  getData: TQuery<[
    ['user_id', number],
    ['net_id', number],
  ], IUserNetDataResponse>;
  setActiveDate: TQuery<[
    ['user_id', number],
    ['net_id', number],
  ]>;
}

export const find = `
  SELECT
    nodes.*,
    nodes.node_id::int,
    nodes.parent_node_id::int,
    nodes.net_id::int,
    nets.net_level,
    nets_users_data.user_id::int,
    nets_users_data.confirmed,
    nets_data.name
  FROM nets_users_data
  INNER JOIN nets ON
    nets.net_id = nets_users_data.net_id
  INNER JOIN nets_data ON
    nets_data.net_id = nets_users_data.net_id
  INNER JOIN nodes ON
    nodes.node_id = nets_users_data.node_id 
  WHERE
    nets_users_data.user_id = $1 AND
    nets_users_data.node_id = $2
`;

export const read = `
  SELECT
    nets.*,
    nets_data.*,
    nodes.parent_node_id,
    nets_users_data.node_id,
    nets_users_data.confirmed
  FROM nets_users_data
  INNER JOIN nets ON
    nets.net_id = nets_users_data.net_id
  INNER JOIN nets_data ON
    nets_data.net_id = nets.net_id
  INNER JOIN nodes ON
    nodes.node_id = nets_users_data.node_id
  WHERE
    nets_users_data.user_id = $1 AND
    nets_users_data.net_id = $2
`;

export const getNetAndSubnets = `
  SELECT
    nodes.*,
    nets.net_level,
    nets_users_data.user_id::int,
    nets_users_data.confirmed,
    nets_data.name
  FROM nets_users_data
  INNER JOIN nets ON
    nets.net_id = nets_users_data.net_id
  INNER JOIN nets_data ON
    nets_data.net_id = nets_users_data.net_id
  INNER JOIN nodes ON
    nodes.node_id = nets_users_data.node_id
  WHERE ${userInNetAndItsSubnets()}
  ORDER BY nets.net_level DESC
`;

export const getData = `
  SELECT
    nodes.node_id,
    nodes.parent_node_id,
    nets_users_data.confirmed,
    users_members.vote,
    SUM (
      CASE
        WHEN um.vote = true THEN 1
        ELSE 0
      END
    ) AS vote_count
  FROM nets_users_data
  INNER JOIN nets ON
    nets.net_id = nets_users_data.net_id
  INNER JOIN nodes ON
    nodes.node_id = nets_users_data.node_id
  LEFT JOIN users_members ON
    users_members.user_id = nets_users_data.user_id AND
    users_members.member_id = nets_users_data.user_id
  LEFT JOIN users_members as um ON
    um.member_id = nets_users_data.user_id AND
    um.parent_node_id = nodes.parent_node_id
  WHERE
    nets_users_data.user_id = $1 AND
    nets_users_data.net_id = $2
  GROUP BY
    nodes.node_id,
    nodes.parent_node_id,
    nets_users_data.confirmed,
    users_members.vote
`;

export const setActiveDate = `
  UPDATE nets_users_data
  SET active_date = now()
  WHERE
    user_id = $1 AND
    net_id = $2
`;
