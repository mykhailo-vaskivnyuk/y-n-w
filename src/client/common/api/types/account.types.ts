import { ITableUsers } from '../../../local/imports';
import { UserStateKeys } from '../../constants';

export type IUserResponse =
  | null
  | Omit<ITableUsers, 'user_id' | 'password'> & {
      user_state: UserStateKeys;
    };

export type ISignupParams = {
  email: string,
};

export type ILoginParams = ISignupParams & {
  password: string,
};
