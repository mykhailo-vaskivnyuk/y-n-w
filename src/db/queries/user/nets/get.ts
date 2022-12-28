import {
  ITableNets, ITableNetsData, ITableNodes,
} from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesUserNets {
  get: TQuery<[
    ['user_id', number],
  ],
    ITableNets &
    ITableNetsData &
    ITableNodes
  >;
}

/*
export type ITableNets = {
  net_id: number;
  net_level: number;
  parent_net_id: number | null;
  first_net_id: number;
  count_of_nets: number;
  ! node_id: number;
}

export type ITableNetsData = {
  net_id: number;
  name: string;
  goal: string | null;
  resource_name: string | null;
  resource_link: string | null;
}

export type ITableNetsUsersData = {
  net_id: number;
  ! user_id: number;
  email_show: boolean;
  name_show: boolean;
  mobile_show: boolean;
}

export type ITableNodes = {
  ! node_id: number;
  node_level: number;
  node_position: number;
  parent_node_id: number | null;
  first_node_id: number;
  count_of_members: number;
  node_date: string;
  blocked: boolean;
  changes: boolean;
  ! user_id: number | null;
}

export type ITableUsersNodesInvites = {
  ! node_id: number;
  ! user_id: number;
  member_name: string;
  token: string;
}
*/

const get = `
  SELECT nets.*, nets_data.name, nodes.node_id
  FROM nets
  INNER JOIN nets_data ON
    nets.net_id = nets_data.net_id
  INNER JOIN nodes ON
    nodes.first_node_id = nets.node_id
  WHERE nodes.user_id = $1
  ORDER BY nets.net_level
`;

// const get = `
//   SELECT *, nodes.node_id, nodes.user_id FROM nets
//   INNER JOIN nets_data ON
//     nets.net_id = nets_data.net_id
//   INNER JOIN nets_users_data ON
//     nets.net_id = nets_users_data.net_id AND
//   INNER JOIN nodes ON
//     nodes.first_node_id = nets.node_id AND
//     nodes.user_id = $1
//   LEFT JOIN users_nodes_invites ON
//     users_nodes_invites.node_id = nodes.node_id
//   WHERE nets_users_data.user_id = $1
//   ORDER BY nets.net_level
// `;

export default get;
