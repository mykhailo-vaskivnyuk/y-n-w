import { ITableNets, ITableNetsData } from '../../../db.types';
import { TQuery } from '../../../types';

export interface IQueriesUserNets {
  get: TQuery<[
    ['user_id', number],
  ], ITableNets & ITableNetsData>;
}

const get = `
  SELECT * FROM nets
  INNER JOIN nets_data ON nets.net_id = nets_data.net_id
  RIGHT JOIN nets_users_data ON
    nets.net_id = nets_users_data.net_id AND
    user_id = $1    
  ORDER BY nets.net_level
`;

export default get;
