/* eslint-disable max-lines */
export const TABLES_MAP = {
  NETS: 'nets',
  NODES: 'nodes',
  USERS: 'users',
  NETS_DATA: 'nets_data',
  NETS_USERS_DATA: 'nets_users_data',
  USERS_NODES_INVITES: 'users_nodes_invites',
  USERS_TOKENS: 'users_tokens',
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
  first_net_id: number;
  count_of_nets: number;
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
  user_id: number;
  email_show: boolean;
  name_show: boolean;
  mobile_show: boolean;
}

export type ITableNodes = {
  node_id: number;
  node_level: number;
  node_position: number;
  parent_node_id: number | null;
  first_node_id: number;
  count_of_members: number;
  node_date: string;
  blocked: boolean;
  changes: boolean;
  user_id: number | null;
}

export type ITableUsersNodesInvites = {
  node_id: number;
  member_name: string;
  token: string;
}
