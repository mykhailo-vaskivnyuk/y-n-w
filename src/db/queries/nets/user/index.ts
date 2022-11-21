import { TQuery } from '../../../types';

export interface IQueriesNetsUser {
  remove: TQuery<[
    ['user_id', number],
    ['net_id', number | null],
  ]>;
}

export const remove = `
  DELETE FROM nets_users_data
  WHERE user_id = $1 AND net_id IN (
    SELECT nets.net_id nets_users_data
    INNER JOIN nets ON nets.net_id = nets_users_data.net_id
    INNER JOIN nets AS net_to_leave
    ON 
      (
        $2 ISNOTNULL AND
        nets.first_node_id = net_to_leave.first_net_id AND
        nets.net_level <= net_to_leave.net_level
      ) OR
      (
        $2 ISNULL AND
        nets.node_id = net_to_leave.net_id
      )
    WHERE user_id = $1
  )
`;
