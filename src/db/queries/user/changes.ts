/* eslint-disable max-lines */
import { ITableEvents } from '../../types/db.tables.types';
import { TQuery } from '../../types/types';

export interface IQueriesUserChanges {
  read: TQuery<[
    ['user_id', number],
    ['date', string | null],
  ], ITableEvents>;
  write: TQuery<[
    ['user_id', number],
    ['date', string],
  ]>;
  confirm: TQuery<[
    ['user_id', number],
    ['event_id', number],
  ]>;
  removeFromCircle: TQuery<[
    ['user_id', number],
    ['net_id', number],
  ]>;
  removeFromTree: TQuery<[
    ['user_id', number],
    ['net_id', number],
  ]>;
  // moveToTmp: TQuery<[
  //   ['node_id', number],
  //   ['parent_node_id', number],
  // // ]>;
  // changeNodes: TQuery<[
  //   ['node_id', number],
  //   ['parent_node_id', number],
  //   ['user_id', number],
  //   ['parent_user_id', number | null],
  // ]>;
  // moveFromTmp: TQuery<[
  //   ['node_id', number],
  //   ['parent_node_id', number],
  // ]>;
  // removeFromTmp: TQuery<[
  //   ['node_id', number],
  //   ['parent_node_id', number],
  // ]>;
}

export const read = `
  SELECT *, TRIM(net_view) as net_view
  FROM events
  WHERE
    user_id = $1 AND (
      $2::timestamp ISNULL OR
      date > $2
    )
  ORDER BY event_id
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
  DELETE FROM events
  WHERE user_id = $1 AND event_id = $2
`;

export const removeFromCircle = `
  DELETE FROM events
  WHERE
    user_id = $1 AND
    net_id = $2 AND
    net_view = 'circle'
`;

export const removeFromTree = `
  DELETE FROM events
  WHERE
    user_id = $1 AND
    net_id = $2 AND
    net_view = 'tree'
`;

// export const moveToTmp = `
//   INSERT INTO events_tmp
//   SELECT * FROM events
//   WHERE
//     (
//       user_node_id = $1 AND (
//         net_view = 'tree' OR
//         net_view = 'net'
//       )
//     ) OR (
//       user_node_id = $2 AND (
//         net_view = 'circle' OR
//         net_view = 'net'
//       )
//     )
// `;

// export const changeNodes = `
//   UPDATE events_tmp
//   SET user_node_id =
//     CASE
//       WHEN user_id = $3 AND user_node_id = $1 THEN +$2
//       ELSE +$1
//     END
//   WHERE user_id IN ($3, $4) AND user_node_id IN ($1, $2)
// `;

// export const moveFromTmp = `
//   INSERT INTO events (
//     user_id,
//     user_node_id,
//     net_view,
//     member_node_id,
//     message,
//     date
//   )
//   SELECT
//     user_id,
//     user_node_id,
//     net_view,
//     member_node_id,
//     message,
//     date
//   FROM events_tmp
//   WHERE user_node_id IN ($1, $2)
//   ORDER BY event_id
// `;

// export const removeFromTmp = `
//   DELETE FROM events_tmp
//   WHERE user_node_id IN ($1, $2)
// `;
