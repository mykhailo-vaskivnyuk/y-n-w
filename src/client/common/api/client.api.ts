/* eslint-disable max-len */
import * as P from './types/types';
import * as Q from './types/client.api.types';

export type IClientApi = ReturnType<typeof getApi>;

export const getApi = (
  fetch: <T>(pathname: string, options?: Record<string, any>) => Promise<T>
) => ({
  'health': () => fetch<string>('/health'),

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
  'net': {
    'comeout': () => fetch<boolean>('/net/comeout'),

    'create': (options: P.INetCreateParams) =>
      fetch<P.INetResponse>('/net/create', options),

    'enter': (options: P.INetReadParams) =>
      fetch<P.INetResponse>('/net/enter', options),

    'getCircle': () => fetch<P.INetCircleResponse>('/net/getCircle'),

    'getTree': () => fetch<P.INetCircleResponse>('/net/getTree'),

    'leave': () => fetch<boolean>('/net/leave'),

  },
  'scripts': {
    'script.js': () => fetch<Q.TScriptsScriptjsResponse>('/scripts/script.js'),

  },
  'user': {
    'update': () => fetch<string>('/user/update'),

    'read': () => fetch<P.IUserResponse>('/user/read'),

    'nets': {
      'get': () => fetch<P.INetsResponse>('/user/nets/get'),

    },
  },
});
