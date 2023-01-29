import { NetEventToKeys, NetEventKeys } from '../api/types/net.types';

export const BUILD_PATH = 'js';
export const MAX_CHAT_MESSAGE_COUNT = 10;
export const MAX_CHAT_MESSAGE_INDEX = 1000;
export const MAX_CHAT_INDEX = 1_000_000;

export const NET_MESSAGES_MAP:
  Record<NetEventKeys, Partial<
    Record<NetEventToKeys, string>
  >> = {
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
    DISLIKE: {
      TREE: 'Вашого координатора від\'єднано через діслайки',
      CONNECTED: `Вас від'єднано від мережі %s
        через від'єднання координатора через діслайки`,
      CIRCLE: 'Учасника вашого кола від\'єднано через діслайки',
      FACILITATOR: 'Учасника вашого кола від\'єднано через діслайки',
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
    }
  };

export const SET_USER_NODE_ID_FOR: NetEventKeys[] = [
  'CONNECT_VOTE',
  'CONNECT_DISVOTE',
];

export const SEND_INSTANT_MESSAGE: NetEventKeys[] = [
  'VOTE',
];
