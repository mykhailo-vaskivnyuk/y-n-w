/* eslint-disable max-lines */
import { TQuery } from '../../../types';

export interface IQueriesUserMembers {
  removeInvites: TQuery<[
    ['net_id', number | null],
    ['user_id', number],
  ]>;
  // removeData: TQuery<[
  //   ['net_id', number | null],
  //   ['user_id', number],
  // ]>;
}

export const removeInvites = `
  DELETE FROM users_nodes_invites
  WHERE user_id = $2 AND node_id IN (
    SELECT nodes.node_id
    FROM nodes
    LEFT JOIN nets ON nodes.first_node_id = nets.node_id
    WHERE
      nodes.user_id = $1 AND (
        (
          ($2 + 1) NOTNULL AND (
            nets.net_id = $2 OR
            nets.net_level > (SELECT net_level FROM nets WHERE net_id = $2)
          )
        ) OR (
          ($2 + 1) ISNULL AND true
        )
      )
  )
`;

// export const removeData = `
//   DELETE FROM users_members
//   WHERE user_id = $2 AND node_id IN (
//     SELECT nodes.node_id
//     FROM nodes
//     LEFT JOIN nets ON nodes.first_node_id = nets.node_id
//     WHERE
//       nodes.user_id = $1 AND (
//         (
//           ($2 + 1) NOTNULL AND (
//             nets.net_id = $2 OR
//             nets.net_level > (SELECT net_level FROM nets WHERE net_id = $2)
//           )
//         ) OR (
//           ($2 + 1) ISNULL AND true
//         )
//       )
//   )
// `;
