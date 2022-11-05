export const TABLES_MAP = {
  SESSIONS: 'sessions',
  USERS: 'users',
  USERS_NOTIFICATIONS: 'users_notifications',
  MEMBERS_USERS: 'members_users',
  NETS: 'nets',
  NETS_DATA: 'nets_data',
  NETS_EVENTS: 'nets_events',
  NETS_USERS_DATA: 'nets_users_data',
  NODES: 'nodes',
  NODES_TMP: 'nodes_tmp',
  NODES_USERS: 'nodes_users',
  NOTIFICATIONS_TPL: 'notifications_tpl',
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

export interface ITableUsersNotifications {
  notification_id: number;
  user_id: number | null;
  code: number | null;
  notification: string | null;
  new: boolean;
  shown: boolean;
  close: boolean;
}

export interface ITableMembersUsers {
  net_id: number | null;
  member_id: number | null;
  user_id: number | null;
  list_name: string | null;
  note: string | null;
  dislike: boolean;
  voice: boolean;
}

export interface ITableNets {
  net_id: number;
  net_level: number | null;
  net_address: number | null;
  parent_net_id: number | null;
  first_net_id: number | null;
  full_net_address: number | null;
  count_of_nets: number | null;
}

export interface ITableNetsData {
  net_id: number;
  name: string | null;
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

export interface ITableNetsEevents {
  event_id: number;
  net_id: number | null;
  user_id: number | null;
  event_node_id: number | null;
  notification_tpl_id: number | null;
  event_code: number | null;
  notification_text: string | null;
  new: boolean;
  shown: boolean;
}

export interface ITableNetsUsersData {
  net_id: number | null;
  user_id: number | null;
  email_show: boolean;
  name_show: boolean;
  mobile_show: boolean;
}

export interface ITableNodes {
  node_id: number;
  node_level: number | null;
  node_address: number | null;
  parent_node_id: number | null;
  first_node_id: number | null;
  full_node_address: number | null;
  count_of_members: number | null;
  node_date: string | null;
  blocked: boolean | null;
  changes: boolean | null;
}

export interface ITableNodesTmp {
  node_id: number | null;
  email: string | null;
  list_name: string | null;
  note: string | null;
}

export interface ITableNodesUsers {
  node_id: number;
  user_id: number | null;
  invite: string | null;
  old_list_name: string | null;
  old_list_note: string | null;
}

export interface ITableNotificationsTpl {
  notification_tpl_id: number;
  event_code: number | null;
  notification_code: number | null;
  notification_text: string | null;
  notification_action: string | null;
  notification_close: boolean;
}
