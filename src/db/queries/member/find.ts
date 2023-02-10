/* eslint-disable max-lines */
import { ITableMembers } from '../../types/db.tables.types';
import { TQuery } from '../../types/types';

export interface IQueriesMemberFind {
  unactive: TQuery<[
    ['date', string],
  ], ITableMembers>;
}

export const unactive = `
  SELECT *,
    members.net_id::int,
    members.user_id::int
  FROM members
  WHERE
    members.active_date < $1 AND
    members.confirmed = true
  LIMIT 1
`;
