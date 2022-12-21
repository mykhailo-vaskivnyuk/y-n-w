/* eslint-disable max-len */
import * as P from './types/types';
import * as Q from './types/client.api.types';

export type IClientApi = ReturnType<typeof getApi>;

export const getApi = (
  fetch: <T>(pathname: string, options?: Record<string, any>) => Promise<T>
) => ({
  'account': {
    'confirm': (options: P.ITokenParams) =>
      fetch<P.IUserResponse>('/account/confirm', options),

    'login': (options: P.ILoginParams) =>
      fetch<P.IUserResponse>('/account/login', options),

    'logout': () => fetch<boolean>('/account/logout'),

    'overmail': (options: P.ISignupParams) =>
      fetch<boolean>('/account/overmail', options),

    'remove': () => fetch<boolean>('/account/remove'),

    'restore': (options: P.ITokenParams) =>
      fetch<P.IUserResponse>('/account/restore', options),

    'signup': (options: P.ISignupParams) =>
      fetch<P.IUserResponse>('/account/signup', options),

  },
  'health': () => fetch<string>('/health'),

  'member': {
    'invite': {
      'create': (options: P.IMemberInviteParams) =>
        fetch<Q.TMemberInviteCreateResponse>('/member/invite/create', options),

      'cancel': (options: Q.TMemberInviteCancel) =>
        fetch<boolean>('/member/invite/cancel', options),

    },
  },
  'net': {
    'comeout': () => fetch<boolean>('/net/comeout'),

    'connectByToken': (options: P.ITokenParams) =>
      fetch<Q.TNetConnectByTokenResponse>('/net/connectByToken', options),

    'create': (options: P.INetCreateParams) =>
      fetch<P.INetResponse>('/net/create', options),

    'enter': (options: P.INetReadParams) =>
      fetch<P.INetResponse>('/net/enter', options),

    'getCircle': () => fetch<P.INetViewResponse>('/net/getCircle'),

    'getTree': () => fetch<P.INetViewResponse>('/net/getTree'),

    'leave': () => fetch<boolean>('/net/leave'),

  },
  'scripts': {
    'script.js': () => fetch<Q.TScriptsScriptjsResponse>('/scripts/script.js'),

  },
  'user': {
    'update': () => fetch<string>('/user/update'),

    'nets': {
      'get': () => fetch<P.INetsResponse>('/user/nets/get'),

    },
    'read': () => fetch<P.IUserResponse>('/user/read'),

  },
});
