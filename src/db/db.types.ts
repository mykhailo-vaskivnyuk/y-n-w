/* eslint-disable max-lines */
export const TABLES_MAP = {
  NETS: 'nets',
  NODES: 'nodes',
  USERS: 'users',
  USERS_TOKENS: 'users_tokens',
  NETS_DATA: 'nets_data',
  NETS_USERS_DATA: 'nets_users_data',
  SESSIONS: 'sessions',
};

export type ITableUsers = {
  user_id: number;
  email: string;
  name: string | null;
  mobile: string | null;
  password: string | null;
  net_name: string | null;
}

export type ITableUsersTokens = {
  user_id: number;
  confirm_token: string | null;
  invite_token: string | null;
  restore_token: string | null;
}

export type ITableSessions = {
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

export type ITableNetsData = {
  net_id: number;
  name: string;
  goal: string | null;
  resource_name_1: string | null;
  resource_link_1: string | null;
  resource_name_2: string | null;
  resource_link_2: string | null;
  resource_name_3: string | null;
  resource_link_3: string | null;
  resource_name_4: string | null;
  resource_link_4: string | null;
}

export type ITableNetsUsersData = {
  net_id: number;
  user_id: number;
  email_show: boolean;
  name_show: boolean;
  mobile_show: boolean;
}

export type ITableNodes = {
  node_id: number;
  node_level: number;
  parent_node_id: number | null;
  first_node_id: number | null;
  count_of_members: number;
  node_date: string;
  blocked: boolean;
  changes: boolean;
}
