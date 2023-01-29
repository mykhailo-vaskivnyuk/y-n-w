/* eslint-disable max-lines */
import { format } from 'node:util';
import { ITableNetsData } from '../../db/db.types';
import {
  IMember, IUserNodeAndNetName,
} from '../../db/types/member.types';
import { NetEventKeys } from '../types/net.types';
import {
  NetViewKeys, IInstantChange,
} from '../../client/common/api/types/types';
import {
  NET_MESSAGES_MAP, SET_USER_NODE_ID_FOR,
} from '../../constants/constants';

export const commitChanges = async (user_id: number, date: string) => {
  await execQuery.user.changes.write([user_id, date]);
  const chatId = chatService.getChatIdOfUser(user_id);
  if (!chatId) return;
  const connectionIds = chatService.getChatConnections(chatId);
  connectionService.sendMessage({ chatId, user_id, index: 0 }, connectionIds);
};

export const createMessagesToConnected = async (
  event: NetEventKeys,
  memberNode: IUserNodeAndNetName,
  user_ids: number[],
  date: string,
) => {
  const { name } = memberNode;
  const message = format(NET_MESSAGES_MAP[event]['CONNECTED'], name);
  for (const user_id of user_ids) {
    await execQuery.net.message.create([
      user_id, null, 'net', null, message, date,
    ]);
    await commitChanges(user_id, date);
  }
};

export const createMessageToMember = async (
  event: NetEventKeys,
  memberNet: IMember & Pick<ITableNetsData, 'name'>,
  date: string,
) => {
  let message = NET_MESSAGES_MAP[event].MEMBER;
  if (!message) return;
  const { name } = memberNet;
  const { user_id, node_id } = memberNet;
  const user_node_id = SET_USER_NODE_ID_FOR.includes(event) ? node_id : null;
  if (!user_node_id) message = format(message, name);
  await execQuery.net.message.create([
    user_id,
    user_node_id,
    'net',
    null,
    message,
    date,
  ]);
  await commitChanges(user_id, date);
};

export const sendInstantMessage = (
  user_id: number, user_node_id: number, net_view: NetViewKeys,
) => {
  const chatId = chatService.getChatIdOfUser(user_id);
  if (!chatId) return;
  const connectionIds = chatService.getChatConnections(chatId);
  const response: IInstantChange = {
    chatId, user_id, index: 0,
    message_id: 0,
    user_node_id,
    net_view,
    member_node_id: null,
    date: '',
  };
  connectionService.sendMessage(response, connectionIds);
};
