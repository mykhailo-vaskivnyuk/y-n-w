/* eslint-disable max-lines */
export const TABLES_MAP = {
  SESSIONS: 'sessions',
  USERS: 'users',
  NETS: 'nets',
  NETS_DATA: 'nets_data',
  NETS_USERS_DATA: 'nets_users_data',
  NODES: 'nodes',
  NODES_USERS: 'nodes_users',
  NODES_NETS: 'nodes_nets',
};

export type ITableUsers = {
  user_id: number;
  email: string;
  name: string | null;
  mobile: string | null;
  password: string | null;
  link: string | null;
  invite: string | null;
  restore: string | null;
  net_name: string | null;
}

export interface ITableSessions {
  session_id: number;
  session_key: string;
  session_value: string;
}

export type ITableNets = {
  net_id: number;
  net_level: number;
  parent_net_id: number | null;
  first_net_id: number | null;
  count_of_nets: number;
}

export interface ITableNetsData {
  net_id: number;
  name: string;
  goal: string;
  resource_name_1: string | null;
  resource_link_1: string | null;
  resource_name_2: string | null;
  resource_link_2: string | null;
  resource_name_3: string | null;
  resource_link_3: string | null;
  resource_name_4: string | null;
  resource_link_4: string | null;
}

export interface ITableNetsUsersData {
  net_id: number;
  user_id: number;
  email_show: boolean;
  name_show: boolean;
  mobile_show: boolean;
}

export interface ITableNodes {
  node_id: number;
  node_level: number;
  node_address: number;
  parent_node_id: number | null;
  first_node_id: number | null;
  count_of_members: number;
  node_date: string;
  blocked: boolean;
  changes: boolean;
}

export interface ITableNodesNets {
  node_id: number;
  net_id: number;
}

export interface ITableNodesUsers {
  node_id: number;
  user_id: number;
  invite: string | null;
}
