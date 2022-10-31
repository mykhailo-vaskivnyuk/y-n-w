import { ITableUsers } from '../../local/imports';

export type IUserResponse =
  | null
  | (Pick<ITableUsers, 'email' | 'name' | 'mobile' | 'net_name'> & {
      confirmed: boolean;
    });
