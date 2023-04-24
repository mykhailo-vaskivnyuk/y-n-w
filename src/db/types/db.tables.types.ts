/* eslint-disable max-lines */
export const TABLES_MAP = {
  NODES: 'nodes',
  NETS: 'nets',
  USERS: 'users',
  NETS_DATA: 'nets_data',
  MEMBERS: 'members',
  MEMBERS_INVITES: 'members_invites',
  EVENTS: 'events',
  BOARD_MESSAGES: 'board_messages',
  USERS_EVENTS: 'users_events',
  USERS_TOKENS: 'users_tokens',
  USERS_MEMBERS: 'users_members',
  SESSIONS: 'sessions',
};

export type OuterJoin<T> =
  | { [key in keyof T]: T[key] }
  | { [key in keyof T]: null };

export type ITableNodes = {
  node_id: number;
  node_level: number;
  parent_node_id: number | null;
  root_node_id: number;  // | null
  node_position: number;
  count_of_members: number;
  updated: string;
}

export type ITableNets = {
  net_id: number;
  net_level: number;
  parent_net_id: number | null;
  first_net_id: number;
  count_of_nets: number;
}

export type ITableUsers = {
  user_id: number;
  email: string;
  name: string | null;
  mobile: string | null;
  password: string | null;
  confirmed: boolean;
}

export type ITableNetsData = {
  net_id: number;
  name: string;
  goal: string | null;
  resource_name: string | null;
  resource_link: string | null;
}

export type ITableMembers = {
  member_id: number;
  node_id: number;
  net_id: number;
  user_id: number;
  email_show: boolean;
  name_show: boolean;
  mobile_show: boolean;
  confirmed: boolean;
}

export type ITableMembersInvites = {
  user_id: number;
  member_node_id: number;
  member_name: string;
  token: string;
}

export type ITableEvents = {
  event_id: number;
  user_id: number;
  net_id: number | null;
  net_view: 'net' | 'tree' | 'circle' | null; /* NetViewKeys */
  from_node_id: number | null;
  event_type: string; /* NetEventKeys */
  message: string;
  date: string;
}

export type ITableBoardMessages = {
  message_id: number;
  net_id: number;
  user_id: number;
  message: string;
  date: string;
}

export type ITableUsersEvents = {
  user_id: number;
  last_event_date: string;
  read_event_date: string;
}

export type ITableUsersTokens = {
  user_id: number;
  token: string;
}

export type ITableUsersMembers = {
  parent_node_id: number;
  user_id: number;
  member_id: number;
  dislike: boolean;
  vote: boolean;
}

export type ITableSessions = {
  session_id: number;
  user_id: number;
  session_key: string;
  session_value: string;
  updated: string;
}
