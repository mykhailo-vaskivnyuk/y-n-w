/* eslint-disable max-lines */
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

    'messenger': {
      'link': {
        'get': () => fetch<Q.TAccountMessengerLinkGetResponse>('/account/messenger/link/get'),

        'connect': (options: Q.TAccountMessengerLinkConnect) =>
          fetch<boolean>('/account/messenger/link/connect', options),

      },
    },
    'overmail': (options: P.ISignupParams) =>
      fetch<boolean>('/account/overmail', options),

    'remove': () => fetch<boolean>('/account/remove'),

    'restore': (options: P.ITokenParams) =>
      fetch<P.IUserResponse>('/account/restore', options),

    'signup': (options: P.ISignupParams) =>
      fetch<P.IUserResponse>('/account/signup', options),

  },
  'chat': {
    'connect': {
      'nets': () => fetch<P.IChatConnectAll>('/chat/connect/nets'),

      'user': () => fetch<boolean>('/chat/connect/user'),

    },
    'sendMessage': (options: P.IChatSendMessage) =>
      fetch<boolean>('/chat/sendMessage', options),

    'getMessages': (options: P.IChatGetMessages) =>
      fetch<P.IChatGetMessagesResponse>('/chat/getMessages', options),

    'removeConnection': () => fetch<boolean>('/chat/removeConnection'),

  },
  'events': {
    'read': (options: Q.TEventsRead) =>
      fetch<P.IEvents>('/events/read', options),

    'confirm': (options: Q.TEventsConfirm) =>
      fetch<boolean>('/events/confirm', options),

  },
  'health': () => fetch<string>('/health'),

  'member': {
    'data': {
      'dislike': {
        'set': (options: P.IMemberConfirmParams) =>
          fetch<boolean>('/member/data/dislike/set', options),

        'unSet': (options: P.IMemberConfirmParams) =>
          fetch<boolean>('/member/data/dislike/unSet', options),

      },
      'vote': {
        'set': (options: P.IMemberConfirmParams) =>
          fetch<boolean>('/member/data/vote/set', options),

        'unSet': (options: P.IMemberConfirmParams) =>
          fetch<boolean>('/member/data/vote/unSet', options),

      },
    },
    'disconnectNotVote': (options: Q.TMemberDisconnectNotVote) =>
      fetch<boolean>('/member/disconnectNotVote', options),

    'disconnectUnactive': (options: Q.TMemberDisconnectUnactive) =>
      fetch<boolean>('/member/disconnectUnactive', options),

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
    'board': {
      'clear': (options: Q.TNetBoardClear) =>
        fetch<boolean>('/net/board/clear', options),

      'read': (options: P.INetReadParams) =>
        fetch<P.INetBoardReadResponse>('/net/board/read', options),

      'remove': (options: P.IBoardRemoveParams) =>
        fetch<boolean>('/net/board/remove', options),

      'save': (options: P.IBoardSaveParams) =>
        fetch<boolean>('/net/board/save', options),

    },
    'connectByToken': (options: P.ITokenParams) =>
      fetch<Q.TNetConnectByTokenResponse>('/net/connectByToken', options),

    'create': (options: P.INetCreateParams) =>
      fetch<P.INetResponse>('/net/create', options),

    'enter': (options: P.INetEnterParams) =>
      fetch<P.INetResponse>('/net/enter', options),

    'getCircle': (options: P.INetReadParams) =>
      fetch<P.INetViewResponse>('/net/getCircle', options),

    'getTree': (options: P.INetReadParams) =>
      fetch<P.INetViewResponse>('/net/getTree', options),

    'leave': (options: P.INetReadParams) =>
      fetch<boolean>('/net/leave', options),

    'update': (options: P.INetUpdateParams) =>
      fetch<P.INetResponse>('/net/update', options),

  },
  'scripts': {
    'script.js': () => fetch<Q.TScriptsScriptjsResponse>('/scripts/script.js'),

  },
  'test': {
    'data': () => fetch<Q.TTestDataResponse>('/test/data'),

  },
  'user': {
    'read': () => fetch<P.IUserResponse>('/user/read'),

    'update': (options: P.IUserUpdateParams) =>
      fetch<P.IUserResponse>('/user/update', options),

    'net': {
      'getData': (options: P.INetEnterParams) =>
        fetch<P.IUserNetDataResponse>('/user/net/getData', options),

    },
    'nets': {
      'get': () => fetch<P.INetsResponse>('/user/nets/get'),

    },
  },
});
