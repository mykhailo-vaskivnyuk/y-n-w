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
    members.user_id::int,
    members.confirmed,
    nets_data.name
  FROM members
  INNER JOIN nets ON
    nets.net_id = members.net_id
  INNER JOIN nets_data ON
    nets_data.net_id = members.net_id
  INNER JOIN nodes ON
    nodes.node_id = members.node_id 
  WHERE
    members.user_id = $1 AND
    members.node_id = $2
`;

export const read = `
  SELECT
    nets.*,
    nets_data.*,
    nodes.parent_node_id,
    members.node_id,
    members.confirmed
  FROM members
  INNER JOIN nets ON
    nets.net_id = members.net_id
  INNER JOIN nets_data ON
    nets_data.net_id = nets.net_id
  INNER JOIN nodes ON
    nodes.node_id = members.node_id
  WHERE
    members.user_id = $1 AND
    members.net_id = $2
`;

export const getNetAndSubnets = `
  SELECT
    nodes.*,
    nets.net_level,
    members.user_id::int,
    members.confirmed,
    nets_data.name
  FROM members
  INNER JOIN nets ON
    nets.net_id = members.net_id
  INNER JOIN nets_data ON
    nets_data.net_id = members.net_id
  INNER JOIN nodes ON
    nodes.node_id = members.node_id
  WHERE ${userInNetAndItsSubnets()}
  ORDER BY nets.net_level DESC
`;

export const getData = `
  SELECT
    nodes.node_id,
    nodes.parent_node_id,
    members.confirmed,
    users_members.vote,
    SUM (
      CASE
        WHEN um.vote = true THEN 1
        ELSE 0
      END
    ) AS vote_count
  FROM members
  INNER JOIN nets ON
    nets.net_id = members.net_id
  INNER JOIN nodes ON
    nodes.node_id = members.node_id
  LEFT JOIN users_members ON
    users_members.user_id = members.user_id AND
    users_members.member_id = members.user_id
  LEFT JOIN users_members as um ON
    um.member_id = members.user_id AND
    um.parent_node_id = nodes.parent_node_id
  WHERE
    members.user_id = $1 AND
    members.net_id = $2
  GROUP BY
    nodes.node_id,
    nodes.parent_node_id,
    members.confirmed,
    users_members.vote
`;

export const setActiveDate = `
  UPDATE members
  SET active_date = now()
  WHERE
    user_id = $1 AND
    net_id = $2
`;
