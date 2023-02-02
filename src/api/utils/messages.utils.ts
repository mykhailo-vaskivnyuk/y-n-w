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
  NET_MESSAGES_MAP, SEND_INSTANT_MESSAGE, SET_USER_NODE_ID_FOR,
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
  // change logic as in createMessagesInNet
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

export const sendNetInstantMessage = (memberNet: IMember, message: string) => {
  const { net: chatId } = chatService.getChatIdsOfNet(memberNet);
  if (!chatId) return;
  // const { user_id, node_id: user_node_id } = memberNet;
  // const userChatId = chatService.getChatIdOfUser(user_id)!;
  const netConnectionIds = chatService.getChatConnections(chatId);
  // const userConnectionId =
  //   chatService.getChatConnections(userChatId)!
  //     .values().next().value as number;
  const response: IInstantChange = {
    chatId, user_id: 0, index: 0, message,
    message_id: 0,
    user_node_id: 0,
    net_view: 'net',
    member_node_id: null,
    date: '',
  };
  // const connectionIds = new Set(netConnectionIds);
  // userConnectionId && connectionIds.delete(userConnectionId);
  connectionService.sendMessage(response, netConnectionIds);
};

export const createMessagesInNet = (
  event: NetEventKeys,
  memberNet: IMember,
) => {
  const isMessage = 'NET' in NET_MESSAGES_MAP[event];
  if (!isMessage) return;
  if (!SEND_INSTANT_MESSAGE.includes(event)) return;
  const message = NET_MESSAGES_MAP[event]['NET'];
  sendNetInstantMessage(memberNet, message!);
};
