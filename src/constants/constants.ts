/* eslint-disable max-len */
/* eslint-disable max-lines */
import { INetEventTo } from '../domain/types/net.event.types';
import { NetEventKeys } from '../client/common/server/types/types';
export const BUILD_PATH = 'js';
export const BUILD_SRC_PATH = 'js/src';
export const MAX_CHAT_MESSAGE_COUNT = 10;
export const MAX_CHAT_MESSAGE_INDEX = 1000;
export const MAX_CHAT_INDEX = 1_000_000;

export const NET_MESSAGES_MAP = {} as Record<NetEventKeys, INetEventTo>;
const map = NET_MESSAGES_MAP;

map.LEAVE = {
  TREE: 'У вашому колі від\'єднався координатор',
  CONNECTED: 'Вас від\'єднано від спільноти %s через від\'єднання координатора',
  CIRCLE: 'Від\'єднався учасник кола',
  FACILITATOR: 'Від\'єднався учасник дерева',
};

map.LEAVE_CONNECTED = {
  FACILITATOR: 'Від\'єднався запрошений учасник',
};

map.CONNECT = {
  FACILITATOR: 'У дереві новий учасник',
};

map.CONFIRM = {
  MEMBER: 'Координатор підтвердив вашу участь в спільноті',
  CIRCLE: 'У колі новий учасник',
};

map.CONNECT_AND_CONFIRM = {
  FACILITATOR: 'У дереві новий учасник',
  CIRCLE: 'У колі новий учасник',
};

map.REFUSE = {
  CONNECTED: 'Вас від\'єднано від спільноти %s через відмову координатора',
};

map.DISLIKE = {};

map.DISLIKE_DISCONNECT = {
  TREE: 'Вашого координатора від\'єднано через діслайки',
  CONNECTED: 'Вас від\'єднано від спільноти %s через від\'єднання координатора через діслайки',
  CIRCLE: 'Учасника вашого кола від\'єднано через діслайки',
  FACILITATOR: 'Учасника вашого дерева від\'єднано через діслайки',
  MEMBER: 'Вас від\'єднано від спільноти %s через діслайки',
};

map.VOTE = {
  CIRCLE: 'Учасник вашого кола проголосував',
};

map.LEAVE_VOTE = {
  TREE: 'Ваш координатор від\'єднався через вибори',
  CONNECTED: 'Вас від\'єднано від спільноти %s через вибори координатора',
};

map.LEAVE_DISVOTE = {
  CONNECTED: 'Вас від\'єднано від спільноти %s через вибори координатора',
  CIRCLE: 'Учасник вашого кола від\'єднався через вибори в його дереві',
  FACILITATOR: 'Учасник вашого дерева від\'єднався через вибори в його дереві',
};

map.CONNECT_VOTE = {
  TREE: 'Учасника вашого кола обрано координатором',
  CIRCLE: 'У вашому колі новий учасник, якого обрали координатором в його колі',
  FACILITATOR: 'У вашому дереві новий учасник, якого обрали координатором в його колі',
  MEMBER: 'Вас обрано координатором',
};

map.CONNECT_DISVOTE = {
  TREE: 'У вас новий координатор через вибори в колі вашого координатора',
  MEMBER: 'Вас переобрано',
};

map.UNACTIVE_DISCONNECT = {
  TREE: 'У вашому колі від\'єднався координатор через неактивність',
  CONNECTED: 'Вас від\'єднано від спільноти %s через від\'єднання координатора через неактивність',
  CIRCLE: 'Від\'єднався учасник кола через неактивність',
  FACILITATOR: 'Від\'єднався учасник вашого дерева через неактивність',
  MEMBER: 'Вас від\'єднано від спільноти %s через неактивність',
};

map.NOT_VOTE = {};

map.NOT_VOTE_DISCONNECT = {
  TREE: 'У вашому колі від\'єднався координатор через невибори',
  CONNECTED: 'Вас від\'єднано від спільноти %s через від\'єднання координатора через невибори',
  MEMBER: 'Вас від\'єднано від спільноти %s через невибори',
};

map.BOARD_MESSAGE = {
  NET: 'Зміни на дошці',
};

export const SET_NET_ID_FOR: NetEventKeys[] = [
  'CONFIRM',
  'CONNECT_VOTE',
  'CONNECT_DISVOTE',
];

export const INSTANT_EVENTS: NetEventKeys[] = [
  // 'CONNECT',
  'VOTE',
  // 'BOARD_MESSAGE',
];
