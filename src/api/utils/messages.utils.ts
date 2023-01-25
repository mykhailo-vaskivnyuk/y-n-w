/* eslint-disable max-lines */
import { format } from 'node:util';
import {
  IMember, IUserNetData, IUserNodeAndNetName,
} from '../../db/types/member.types';
import { NetEventKeys } from '../types/net.types';
import { NET_MESSAGES_MAP } from '../../constants/constants';

const commitChanges = async (user_id: number, date: string) => {
  await execQuery.user.changes.write([user_id, date]);
  const chatId = chatService.getChatIdOfUser(user_id);
  const connectionIds = chatService.getChatConnections(chatId);
  connectionService.sendMessage({ chatId, user_id, index: 0 }, connectionIds);
};

const createMessagesToFacilitator = async (
  event: NetEventKeys,
  user: IMember,
  memberNet: IUserNetData,
  date: string,
) => {
  const { user_id, node_id: user_node_id } = user;
  const { node_id: member_node_id } = memberNet;
  const message = NET_MESSAGES_MAP[event]['FACILITATOR']!;
  await execQuery.net.message.create([
    user_id,
    user_node_id,
    'tree',
    member_node_id,
    message,
    date,
  ]);
  await commitChanges(user_id, date);
};

const cretaeMessagesToCircleMembers = async (
  event: NetEventKeys,
  user: IMember,
  memberNet: IUserNetData,
  date: string,
) => {
  const { user_id, node_id: user_node_id } = user;
  const { node_id: member_node_id } = memberNet;
  const message = NET_MESSAGES_MAP[event]['CIRCLE']!;
  await execQuery.net.message.create([
    user_id,
    user_node_id,
    'circle',
    member_node_id,
    message,
    date,
  ]);
  await commitChanges(user_id, date);
};

const createMessagesInTree = async (
  event: NetEventKeys, memberNet: IUserNetData,  date: string,
) => {
  const { node_id: member_node_id, confirmed } = memberNet;
  if (!confirmed) return;
  const users = await execQuery.net.tree.getMembers([member_node_id]);
  const message = NET_MESSAGES_MAP[event]['TREE']!;
  for (const { user_id, node_id: user_node_id } of users) {
    await execQuery.net.message.create([
      user_id,
      user_node_id,
      'circle',
      member_node_id,
      message,
      date,
    ]);
    await commitChanges(user_id, date);
  }
};

const createMessagesInCircle = async (
  event: NetEventKeys, memberNet: IUserNetData,  date: string,
) => {
  const { node_id: member_node_id, parent_node_id, confirmed } = memberNet;
  if (!confirmed) return;
  if (!parent_node_id) return;
  const users = await execQuery.net.circle
    .getMembers([member_node_id, parent_node_id]);
  for (const user of users) {
    const { node_id: user_node_id, confirmed: user_confirmed } = user;
    if (user_node_id === parent_node_id) {
      await createMessagesToFacilitator(event, user, memberNet, date);
    } else if (!user_confirmed) continue;
    else {
      await cretaeMessagesToCircleMembers(event, user, memberNet,  date);
    }
  }
};

export const createMessages = async (
  event: NetEventKeys,
  memberNet: IUserNetData,
  date: string,
) => {
  await createMessagesInTree(event, memberNet, date);
  await createMessagesInCircle(event, memberNet, date);
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
      user_id, null, 'circle', null, message, date,
    ]);
    await commitChanges(user_id, date);
  }
};
