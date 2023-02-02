/* eslint-disable max-lines */
import { ITableUsersMessages } from '../../db.types';
import { TQuery } from '../../types/types';

export interface IQueriesUserChanges {
  read: TQuery<[
    ['user_id', number],
    ['date', string | null],
  ], ITableUsersMessages>;
  write: TQuery<[
    ['user_id', number],
    ['date', string],
  ]>;
  confirm: TQuery<[
    ['user_id', number],
    ['message_id', number],
  ]>;
  removeFromCircle: TQuery<[
    ['user_id', number],
    ['user_node_id', number],
  ]>;
  removeFromTree: TQuery<[
    ['user_id', number],
    ['user_node_id', number],
  ]>;
  moveToTmp: TQuery<[
    ['node_id', number],
    ['parent_node_id', number],
  ]>;
  changeNodes: TQuery<[
    ['node_id', number],
    ['parent_node_id', number],
    ['user_id', number],
    ['parent_user_id', number | null],
  ]>;
  moveFromTmp: TQuery<[
    ['node_id', number],
    ['parent_node_id', number],
  ]>;
  removeFromTmp: TQuery<[
    ['node_id', number],
    ['parent_node_id', number],
  ]>;
}

export const read = `
  SELECT *, TRIM(net_view) as net_view
  FROM users_messages
  WHERE
    user_id = $1 AND (
      $2::timestamp ISNULL OR
      date > $2
    )
  ORDER BY message_id
`;

export const write = `
  INSERT INTO users_changes AS uc (
    user_id, date
  )
  VALUES ($1, $2)
  ON CONFLICT (user_id)
    DO UPDATE
    SET date = $2
    WHERE uc.user_id = $1
`;

export const confirm = `
  DELETE FROM users_messages
  WHERE user_id = $1 AND message_id = $2
`;

export const removeFromCircle = `
  DELETE FROM users_messages
  WHERE
    user_id = $1 AND
    user_node_id = $2 AND
    net_view = 'circle'
`;

export const removeFromTree = `
  DELETE FROM users_messages
  WHERE
    user_id = $1 AND
    user_node_id = $2 AND
    net_view = 'tree'
`;

export const moveToTmp = `
  INSERT INTO users_messages_tmp
  SELECT * FROM users_messages
  WHERE
    (
      user_node_id = $1 AND (
        net_view = 'tree' OR
        net_view = 'net'
      )
    ) OR (
      user_node_id = $2 AND (
        net_view = 'circle' OR
        net_view = 'net'
      )
    )
`;

export const changeNodes = `
  UPDATE users_messages_tmp
  SET user_node_id =
    CASE
      WHEN user_id = $3 AND user_node_id = $1 THEN +$2
      ELSE +$1
    END
  WHERE user_id IN ($3, $4) AND user_node_id IN ($1, $2)
`;

export const moveFromTmp = `
  INSERT INTO users_messages (
    user_id,
    user_node_id,
    net_view,
    member_node_id,
    message,
    date
  )
  SELECT
    user_id,
    user_node_id,
    net_view,
    member_node_id,
    message,
    date
  FROM users_messages_tmp
  WHERE user_node_id IN ($1, $2)
  ORDER BY message_id
`;

export const removeFromTmp = `
  DELETE FROM users_messages_tmp
  WHERE user_node_id IN ($1, $2)
`;
