import { ITableNodes } from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesNetNodes {
  removeUser: TQuery<[
    ['net_id', number | null],
    ['user_id', number],
  ], ITableNodes>;
}

const removeUser = `
  UPDATE nodes
  SET user_id = NULL, count_of_members = count_of_members - 1
  WHERE node_id IN (
    SELECT nodes.node_id FROM nodes
    LEFT JOIN nets ON nodes.first_node_id = nets.node_id
    WHERE 
      nodes.user_id = $2 AND (
        (
          ($1 + 1) NOTNULL AND (
            nets.net_id = $1 OR
            nets.net_level > (SELECT net_level FROM nets WHERE net_id = $1)
          )
        ) OR (
          ($1 + 1) ISNULL AND true
        )
      )
    )
`;

export default removeUser;
