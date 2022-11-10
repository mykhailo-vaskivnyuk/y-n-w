import { ITableUsers } from '../../local/imports';
import { TAccountLogin } from './client.api.types';

export type TFetch = <T>(
  pathname: string, options?: Record<string, any>,
) => Promise<T>;

export type IUserResponse =
  | null
  | (Pick<ITableUsers, 'email' | 'name' | 'mobile' | 'net_name'> & {
      confirmed: boolean;
    });

export type ISignupParams = {
  email: string,
};

export type IConfirmParams = {
  token: string,
};

export type TLoginOrSignup =
  | ['login', TAccountLogin]
  | ['signup', ISignupParams];
