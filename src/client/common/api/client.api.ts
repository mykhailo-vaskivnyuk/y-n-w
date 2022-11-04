import { IUserResponse } from './types';
import * as Types from './client.api.types';

export const getApi = (
  fetch: <T>(pathname: string, options?: Record<string, any>) => Promise<T>
) => ({
  'account': {
    'confirm': (options: Types.TAccountConfirm) => fetch<IUserResponse>('/account/confirm', options),
    'login': (options: Types.TAccountLogin) => fetch<IUserResponse>('/account/login', options),
    'logout': () => fetch<Types.TAccountLogoutResponse>('/account/logout'),
    'overmail': (options: Types.TAccountOvermail) => fetch<Types.TAccountOvermailResponse>('/account/overmail', options),
    'remove': () => fetch<Types.TAccountRemoveResponse>('/account/remove'),
    'restore': (options: Types.TAccountRestore) => fetch<IUserResponse>('/account/restore', options),
    'signup': (options: Types.TAccountSignup) => fetch<IUserResponse>('/account/signup', options),
  },
  'index': () => fetch<Types.TIndexResponse>('/index'),
  'merega': {
    'read': () => fetch<Types.TMeregaReadResponse>('/merega/read'),
  },
  'scripts': {
    'script.js': () => fetch<Types.TScriptsScript_jsResponse>('/scripts/script.js'),
  },
  'user': {
    'create': (options: Types.TUserCreate) => fetch<Types.TUserCreateResponse>('/user/create', options),
    'update': () => fetch<Types.TUserUpdateResponse>('/user/update'),
    'read': () => fetch<IUserResponse>('/user/read'),
  },
});
