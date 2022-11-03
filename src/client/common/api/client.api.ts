import { IUserResponse } from './types';
import * as Types from './client.api.types';

export const api = (
  fetch: <T>(pathname: string, options?: Record<string, any>) => Promise<T>
) => ({
  'account': {
    'confirm': (options: Types.TAccountConfirm) => fetch<Types.TAccountConfirmResponse>('/account/confirm', options),
    'login': (options: Types.TAccountLogin) => fetch<Types.TAccountLoginResponse>('/account/login', options),
    'logout': () => fetch<Types.TAccountLogoutResponse>('/account/logout'),
    'overmail': (options: Types.TAccountOvermail) => fetch<Types.TAccountOvermailResponse>('/account/overmail', options),
    'remove': () => fetch<Types.TAccountRemoveResponse>('/account/remove'),
    'restore': (options: Types.TAccountRestore) => fetch<Types.TAccountRestoreResponse>('/account/restore', options),
    'signup': (options: Types.TAccountSignup) => fetch<Types.TAccountSignupResponse>('/account/signup', options),
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
    'read': () => fetch<Types.TUserReadResponse>('/user/read'),
  },
});
