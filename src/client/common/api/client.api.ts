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
      'cancel': (options: P.IMemberConfirmParams) =>
        fetch<boolean>('/member/invite/cancel', options),

      'confirm': (options: P.IMemberConfirmParams) =>
        fetch<boolean>('/member/invite/confirm', options),

      'create': (options: P.IMemberInviteParams) =>
        fetch<Q.TMemberInviteCreateResponse>('/member/invite/create', options),

      'refuse': (options: P.IMemberConfirmParams) =>
        fetch<boolean>('/member/invite/refuse', options),

    },
  },
  'net': {
    'connectByToken': (options: P.ITokenParams) =>
      fetch<Q.TNetConnectByTokenResponse>('/net/connectByToken', options),

    'create': (options: P.INetCreateParams) =>
      fetch<P.INetResponse>('/net/create', options),

    'enter': (options: P.INetReadParams) =>
      fetch<P.INetResponse>('/net/enter', options),

    'getCircle': (options: P.INetReadParams) =>
      fetch<P.INetViewResponse>('/net/getCircle', options),

    'getTree': (options: P.INetReadParams) =>
      fetch<P.INetViewResponse>('/net/getTree', options),

    'leave': (options: P.INetReadParams) =>
      fetch<boolean>('/net/leave', options),

  },
  'scripts': {
    'script.js': () => fetch<Q.TScriptsScriptjsResponse>('/scripts/script.js'),

  },
  'test': {
    'data': () => fetch<Q.TTestDataResponse>('/test/data'),

  },
  'user': {
    'update': () => fetch<string>('/user/update'),

    'nets': {
      'get': () => fetch<P.INetsResponse>('/user/nets/get'),

    },
    'read': () => fetch<P.IUserResponse>('/user/read'),

  },
});
