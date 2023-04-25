/* eslint-disable max-lines */
import { IMemberWithNetId } from '../../types/member.types';
import { TQuery } from '../../types/types';

export interface IQueriesMemberFind {
  unactive: TQuery<[
    ['date', string],
  ], IMemberWithNetId>;
}

export const unactive = `
  SELECT
    members.*,
    members.user_id::int,
    nets.net_id::int,
  FROM members
  INNER JOIN nodes ON
    nodes.node_id = members.member_id
  INNER JOIN nets ON
    nets.node_id = nodes.root_node_id
  WHERE
    members.active_date < $1 AND
    members.confirmed = true
  LIMIT 1
`;
