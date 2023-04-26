/* eslint-disable max-lines */
import { format } from 'node:util';
import { ITableNetsData } from '../../../db/types/db.tables.types';
import {
  IMember, IUserNodeAndNetName,
} from '../../../db/types/member.types';
import { NetEventKeys } from '../../../client/common/server/types/types';
import {
  NET_MESSAGES_MAP, SET_USER_NODE_ID_FOR,
} from '../../../constants/constants';

export const commitEvents = async (user_id: number, date: string) => {
  await execQuery.user.events.write([user_id, date]);
  const chatId = chatService.getChatIdOfUser(user_id);
  if (!chatId) return;
  const connectionIds = chatService.getChatConnections(chatId);
  connectionService.sendMessage({ type: 'NEW_EVENTS' }, connectionIds);
};

export const createMessagesToConnected = async (
  event: NetEventKeys,
  fromMember: IUserNodeAndNetName,
  user_ids: number[],
  date: string,
) => {
  const { name } = fromMember;
  const message = format(NET_MESSAGES_MAP[event]['CONNECTED'], name);
  for (const user_id of user_ids) {
    await execQuery.net.message.create([
      user_id,
      null,
      'net',
      null,
      event,
      message,
      date,
    ]);
    await commitEvents(user_id, date);
  }
};

export const createMessageToMember = async (
  event: NetEventKeys,
  fromMember: IMember & Pick<ITableNetsData, 'name'>,
  date: string,
) => {
  let message = NET_MESSAGES_MAP[event].MEMBER;
  if (!message) return;
  const { name } = fromMember;
  const { user_id, node_id } = fromMember;
  const user_node_id = SET_USER_NODE_ID_FOR.includes(event) ? node_id : null;
  if (!user_node_id) message = format(message, name);
  await execQuery.net.message.create([
    user_id,
    user_node_id,
    'net',
    null,
    event,
    message,
    date,
  ]);
  await commitEvents(user_id, date);
};
