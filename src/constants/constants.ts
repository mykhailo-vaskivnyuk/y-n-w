import { INetEventTo } from '../api/types/net.types';
import { NetEventKeys } from '../client/common/server/types/types';
export const BUILD_PATH = 'js';
export const BUILD_SRC_PATH = 'js/src';
export const MAX_CHAT_MESSAGE_COUNT = 10;
export const MAX_CHAT_MESSAGE_INDEX = 1000;
export const MAX_CHAT_INDEX = 1_000_000;

export const NET_MESSAGES_MAP:
  Record<NetEventKeys, INetEventTo> = {
    LEAVE: {
      TREE: 'У вашому колі від\'єднався координатор',
      CONNECTED:
        'Вас від\'єднано від мережі %s через від\'єднання координатора',
      CIRCLE: 'Від\'єднався учасник кола',
      FACILITATOR: 'Від\'єднався учасник вашого дерева',
    },
    LEAVE_CONNECTED: {
      FACILITATOR: 'Від\'єднався запрошений учасник',
    },
    REFUSE: {
      CONNECTED: 'Вас від\'єднано від мережі %s через відмову координатора',
    },
    DISLIKE: {},
    DISLIKE_DISCONNECT: {
      TREE: 'Вашого координатора від\'єднано через діслайки',
      CONNECTED: `Вас від'єднано від мережі %s
        через від'єднання координатора через діслайки`,
      CIRCLE: 'Учасника вашого кола від\'єднано через діслайки',
      FACILITATOR: 'Учасника вашого кола від\'єднано через діслайки',
      MEMBER: 'Вас від\'єднано від мережі %s через діслайки',
    },
    VOTE: {
      CIRCLE: 'Учасник вашого кола проголосував',
    },
    LEAVE_VOTE: {
      TREE: 'Ваш координатор від\'єднався через вибори',
      CONNECTED: 'Вас від\'єднано від мережі %s через вибори координатора',
    },
    LEAVE_DISVOTE: {
      CONNECTED: 'Вас від\'єднано від мережі %s через вибори координатора',
      CIRCLE: `Учасник вашого кола від'єднався через переобрання
        координатора в його дереві`,
      FACILITATOR: `Учасник вашого дерева від'єднався через переобрання
        координатора в його дереві`,
    },
    CONNECT_VOTE: {
      TREE: 'Учасника вашого кола обрано координатором',
      CIRCLE:
        'У вашому колі новий учасник, якого обрали координатором в його колі',
      FACILITATOR:
        'У вашому дереві новий учасник, якого обрали координатором в його колі',
      MEMBER: 'Вас обрано координатором',
    },
    CONNECT_DISVOTE: {
      TREE: 'У вас новий координатор через обрання вашого координатора',
      MEMBER: 'Вас переобрано',
    },
    UNACTIVE_DISCONNECT: {
      TREE: 'У вашому колі від\'єднався координатор через неактивність',
      CONNECTED:
        `Вас від'єднано від мережі %s через від'єднання координатора
        через неактивність`,
      CIRCLE: 'Від\'єднався учасник кола через неактивність',
      FACILITATOR: 'Від\'єднався учасник вашого дерева через неактивність',
      MEMBER: 'Вас від\'єднано від мережі %s через неактивність',
    },
    NOT_VOTE_DISCONNECT: {
      TREE: 'У вашому колі від\'єднався координатор через невибори',
      CONNECTED:
        `Вас від'єднано від мережі %s через від'єднання координатора
        через невибори`,
      MEMBER: 'Вас від\'єднано від мережі %s через невибори',
    },
    BOARD_MESSAGE: {
      NET: '',
    },
  };

export const SET_USER_NODE_ID_FOR: NetEventKeys[] = [
  'CONNECT_VOTE',
  'CONNECT_DISVOTE',
];

export const INSTANT_EVENTS: NetEventKeys[] = [
  'VOTE',
  'BOARD_MESSAGE',
];
