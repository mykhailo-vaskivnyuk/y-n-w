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
  MEMBERS_TO_MEMBERS: 'members_to_members',
  SESSIONS: 'sessions',
};

export type OuterJoin<T> = { [key in keyof T]: T[key] | null };

export type ITableNodes = {
  node_id: number;
  node_level: number;
  parent_node_id: number | null;
  net_id: number;
  node_position: number;
  count_of_members: number;
  updated: string;
};

export type ITableNets = {
  net_id: number;
  net_level: number;
  parent_net_id: number | null;
  root_net_id: number; // | null
  count_of_nets: number;
  blocked: boolean;
};

export type ITableUsers = {
  user_id: number;
  email: string | null;
  name: string | null;
  mobile: string | null;
  password: string | null;
  confirmed: boolean;
  chat_id: string | null;
};

export type ITableNetsData = {
  net_id: number;
  name: string;
  goal: string | null;
  resource_name: string | null;
  net_link: string | null;
};

export type ITableNetsGuests = {
  net_id: number;
  user_id: number;
  comment: string;
};

export type ITableMembers = {
  member_id: number;
  user_id: number;
  email_show: boolean;
  name_show: boolean;
  mobile_show: boolean;
  confirmed: boolean;
};

export type ITableMembersInvites = {
  member_id: number;
  node_id: number;
  member_name: string;
  token: string;
};

export type ITableEvents = {
  event_id: number;
  user_id: number;
  net_id: number | null;
  net_view: 'net' | 'tree' | 'circle' | null /* NetViewKeys */;
  from_node_id: number | null;
  event_type: string /* NetEventKeys */;
  message: string;
  date: string;
};

export type ITableBoardMessages = {
  message_id: number;
  net_id: number;
  member_id: number;
  message: string;
  date: string;
};

export type ITableUsersEvents = {
  user_id: number;
  notification_date: string;
};

export type ITableUsersTokens = {
  user_id: number;
  token: string;
};

export type ITableMembersToMembers = {
  branch_id: number;
  from_member_id: number;
  to_member_id: number;
  dislike: boolean;
  vote: boolean;
  replacing: boolean;
};

export type ITableSessions = {
  session_id: number;
  user_id: number;
  session_key: string;
  session_value: string;
  updated: string;
};
