import { ITableUsers } from '../../../local/imports';
import { UserStatusKeys } from './user.types';

export type IUserResponse = null |
  Omit<ITableUsers, 'password' | 'confirmed'> & {
    user_status: UserStatusKeys;
  };

export type ISignupParams = {
  email: string,
};

export type ILoginParams = ISignupParams & {
  password: string,
};

export type IUserUpdateParams = {
  name: string,
  mobile: string,
  password: string,
};
