import * as P from './types';
import * as Q from './client.api.types';

export type IClientApi = ReturnType<typeof getApi>;

export const getApi = (
  fetch: <T>(pathname: string, options?: Record<string, any>) => Promise<T>
) => ({
  'account': {
    'confirm': (options: P.IConfirmParams) =>
      fetch<P.IUserResponse>('/account/confirm', options),

    'login': (options: Q.TAccountLogin) =>
      fetch<P.IUserResponse>('/account/login', options),

    'logout': () => fetch<boolean>('/account/logout'),

    'overmail': (options: P.ISignupParams) =>
      fetch<boolean>('/account/overmail', options),

    'remove': () => fetch<boolean>('/account/remove'),

    'restore': (options: P.IConfirmParams) =>
      fetch<P.IUserResponse>('/account/restore', options),

    'signup': (options: P.ISignupParams) =>
      fetch<P.IUserResponse>('/account/signup', options),

  },
  'index': () => fetch<string>('/index'),

  'health': () => fetch<string>('/health'),

  'merega': {
    'read': () => fetch<Q.TMeregaReadResponse>('/merega/read'),

  },
  'scripts': {
    'script.js': () => fetch<Q.TScriptsScriptjsResponse>('/scripts/script.js'),

  },
  'user': {
    'create': (options: Q.TUserCreate) =>
      fetch<Q.TUserCreateResponse>('/user/create', options),

    'update': () => fetch<string>('/user/update'),

    'read': () => fetch<P.IUserResponse>('/user/read'),

  },
});
