/* eslint-disable max-len */
import * as P from './types/types';
import * as Q from './types/client.api.types';

export type IClientApi = ReturnType<typeof getApi>;

export const getApi = (
  fetch: <T>(pathname: string, options?: Record<string, any>) => Promise<T>
) => ({
  'account': {
    'confirm': (options: P.IConfirmParams) =>
      fetch<P.IUserResponse>('/account/confirm', options),

    'login': (options: P.ILoginParams) =>
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

  'net': {
    'create': (options: P.INetCreateParams) =>
      fetch<P.INetResponse>('/net/create', options),

    'getParents': () => fetch<P.INetSimpleResponse>('/net/getParents'),

    'leave': () => fetch<boolean>('/net/leave'),

  },
  'scripts': {
    'script.js': () => fetch<Q.TScriptsScriptjsResponse>('/scripts/script.js'),

  },
  'user': {
    'update': () => fetch<string>('/user/update'),

    'net': {
      'enter': (options: P.INetReadParams) =>
        fetch<P.INetResponse>('/user/net/enter', options),

      'getChildren': () => fetch<P.INetSimpleResponse>('/user/net/getChildren'),

    },
    'read': () => fetch<P.IUserResponse>('/user/read'),

  },
});
