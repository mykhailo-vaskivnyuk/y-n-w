import { ITableNets } from '../../db.types';
import { TQuery } from '../../types';

export interface IQueriesTest {
  getNetsByParent: TQuery<[
    ['net_id', number | null],
  ], ITableNets>;
}

export const getNetsByParent = `
  SELECT nets.* FROM nets
  WHERE ($1 + 1) ISNULL OR parent_net_id = $1;
`;
