import { ITableUsers } from '../../../local/imports';
import { UserStatusKeys } from './user.types';

export type IUserResponse =
  | null
  | (Omit<ITableUsers, 'password' | 'confirmed'> & {
      user_status: UserStatusKeys;
    });

export type ISignupParams = {
  name: string;
  email: string;
};

export type ILoginParams = {
  email: string;
  password: string;
};

export type IEnterParams = {
  email: string;
};

export type IUserUpdateParams = {
  name: string;
  mobile: string;
  password: string;
};

export type IMessengerLinkConnectParams = {
  chatId: string;
  token: string;
};
