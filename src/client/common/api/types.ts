import { ITableUsers } from '../../local/imports';

export type IUserResponse =
  | null
  | (Pick<ITableUsers, 'email' | 'name' | 'mobile' | 'net_name'> & {
      confirmed: boolean;
    });

export type ISignupParams = {
  email: string,
};

export type ILoginParams = ISignupParams & {
  password: string,
};

export type IConfirmParams = {
  token: string,
};
