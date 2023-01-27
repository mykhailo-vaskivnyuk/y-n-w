import { NetEventToKeys, NetEventKeys } from '../api/types/net.types';

export const BUILD_PATH = 'js';
export const MAX_CHAT_MESSAGE_COUNT = 10;
export const MAX_CHAT_MESSAGE_INDEX = 1000;
export const MAX_CHAT_INDEX = 1_000_000;

export const NET_VIEW_MESSAGES_MAP:
  Record<NetEventKeys, Partial<
    Record<NetEventToKeys, string>
  >> = {
    LEAVE: {
      TREE: 'У вашому колі від\'єднався координатор',
      CONNECTED:
        'Вас від\'єднано від мережі %s через від\'єднання координатора',
      CIRCLE: 'Від\'єднався учасник кола',
      FACILITATOR: 'Від\'єднався учасник дерева',
    },
    LEAVE_CONNECTED: {
      FACILITATOR: 'Від\'єднався запрошений учасник',
    },
    REFUSE: {
      CONNECTED: 'Вас від\'єднано від мережі %s через відмову координатора',
    },
    DISLIKE: {
      TREE: '',
      CONNECTED: '',
      CIRCLE: '',
      FACILITATOR: '',
    },
    LEAVE_VOTE: {
      TREE: 'Ваш координатор від\'єднався через вибори',
      CONNECTED: 'Вас від\'єднано від мережі %s через вибори координатора',
    },
    LEAVE_DISVOTE: {
      CONNECTED: 'Вас від\'єднано від мережі %s через вибори координатора',
    },
    CONNECT_VOTE: {
      TREE: 'Учасника вашого кола вибрано координатором',
      CIRCLE:
        'У вашому колі новий учасник, якого обрали координатором в його колі',
      FACILITATOR:
        'У вашому колі новий учасник, якого обрали координатором в його колі',
    },
    CONNECT_DISVOTE: {
      TREE: 'У вас новий координатор через обрання вашого координатора',
    }
  };

export const NET_MESSAGES_MAP: Partial<Record<NetEventKeys, string>> = {
  CONNECT_VOTE: '',
  CONNECT_DISVOTE: '',
  DISLIKE: '',
};
