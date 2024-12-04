/* eslint-disable max-lines */
import { ITableUsers } from '../../../domain/types/db.types';
import { TQuery } from '../../types/types';

export interface IQueriesNetUsers {
  toSendNewEvents: TQuery<[
    ['net_id', number],
    ['from_node_id', number | null],
    ['event_type', string],
  ], Pick<ITableUsers, 'user_id'>>;
  toSendWaitingEvents: TQuery<[
    ['net_id', number],
    ['event_type', string],
  ], Pick<ITableUsers, 'user_id'>>;
  toNotifyOnTg: TQuery<[
    ['net_id', number],
    ['from_node_id', number | null],
    ['notification_date', string],
  ], ITableUsers>;
  toNotifyOnEmail: TQuery<[
    ['net_id', number],
    ['from_node_id', number | null],
    ['notification_date', string],
  ], ITableUsers>;
}

export const toSendNewEvents = `
  SELECT DISTINCT users.user_id::int
  FROM nodes
  INNER JOIN members ON
    members.member_id = nodes.node_id AND
    members.confirmed = true
  INNER JOIN users ON
    users.user_id = members.user_id
  LEFT JOIN events ON
    events.net_id = nodes.net_id AND
    events.user_id = users.user_id AND
    events.event_type = $3 AND
    events.event_id ISNULL
  WHERE
    nodes.net_id = $1 AND (
    $2::int ISNULL OR
    nodes.node_id <> $2
  )
`;

export const toSendWaitingEvents = `
  SELECT DISTINCT users.user_id::int
  FROM nodes
  INNER JOIN members ON
    members.member_id = nodes.node_id AND
    members.confirmed = true
  INNER JOIN users ON
    users.user_id = members.user_id
  INNER JOIN nodes AS nds ON
    nds.parent_node_id = nodes.node_id
  LEFT JOIN members AS mbs ON
    mbs.member_id = nds.node_id AND mbs.member_id ISNULL
  LEFT JOIN events ON
    events.net_id = nodes.net_id AND
    events.user_id = users.user_id AND
    events.event_type = $2 AND
    events.event_id ISNULL
  WHERE
    nodes.net_id = $1
`;

export const toNotifyOnTg = `
  SELECT DISTINCT ON (users.user_id) users.*, users.user_id::int
  FROM nodes
  INNER JOIN members ON
    members.member_id = nodes.node_id AND
    members.confirmed = true
  INNER JOIN users ON
    users.user_id = members.user_id AND
    users.chat_id IS NOT NULL
  LEFT JOIN users_events ON
    users_events.user_id = users.user_id
  WHERE
    nodes.net_id = $1 AND (
      $2::int ISNULL OR
      nodes.node_id <> $2
    ) AND (
      users_events.user_id ISNULL OR
      users_events.notification_date < $3
    )
`;


export const toNotifyOnEmail = `
  SELECT DISTINCT users.*, users.user_id::int
  FROM nodes
  INNER JOIN members ON
    members.member_id = nodes.node_id AND
    members.confirmed = true
  INNER JOIN users ON
    users.user_id = members.user_id AND
    users.chat_id ISNULL
  LEFT JOIN users_events ON
    users_events.user_id = users.user_id
  WHERE
    nodes.net_id = $1 AND (
      $2::int ISNULL OR
      nodes.node_id <> $2
    ) AND (
      users_events.user_id ISNULL OR
      users_events.notification_date < $3
    )
`;
