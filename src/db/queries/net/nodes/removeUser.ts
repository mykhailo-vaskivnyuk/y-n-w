import { ITableNodes } from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesNetNodes {
  removeUser: TQuery<[
    ['net_node_id', number | null],
    ['user_id', number],
  ], ITableNodes>;
}

const removeUser = `
  UPDATE nodes
  SET count_of_members = count_of_members - 1
  WHERE node_id IN (
    SELECT node_id
    FROM nets_users_data
    INNER JOIN nets ON
      nets.net_node_id = nets_users_data.net_node_id
    WHERE 
      user_id = $2 AND ((
        ($1 + 1) NOTNULL AND
        nets.first_net_id = $1 AND
        nets.net_level >= (SELECT net_level FROM nets WHERE net_node_id = $1)
      ) OR ($1 + 1) ISNULL)
    )
`;

export default removeUser;
