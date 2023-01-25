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
      FACILITATOR: 'Від\'єднався учасник дерева',
    },
    LEAVE_CONNECTED: {
      FACILITATOR: 'Від\'єднався запрошений учасник',
    },
    REFUSE: {
      CONNECTED: 'Вас від\'єднано від мережі %s через відмову координатора',
    },
    VOTE: {
      CONNECTED: 'Вас від\'єднано від мережі %s через вибори координатора',
    }
  };
