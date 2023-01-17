import { ITableUsers } from '../../../local/imports';
import { UserStatusKeys } from './user.types';

export type IUserResponse = null |
  Omit<ITableUsers, 'password'> & {
    user_status: UserStatusKeys;
  };

export type ISignupParams = {
  email: string,
};

export type ILoginParams = ISignupParams & {
  password: string,
};
