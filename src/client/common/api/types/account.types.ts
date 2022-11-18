import { ITableUsers } from '../../../local/imports';
import { UserStateKeys } from '../../constants';

export type IUserResponse =
  | null
  | Omit<ITableUsers, 'user_id' | 'password'> & {
      user_state: UserStateKeys;
      net_id?: number
    };

export type ISignupParams = {
  email: string,
};

export type ILoginParams = ISignupParams & {
  password: string,
};

export type IConfirmParams = {
  token: string,
};
