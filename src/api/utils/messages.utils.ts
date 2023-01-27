/* eslint-disable max-lines */
import { format } from 'node:util';
import {
  IMember, IMemberWithNet, IUserNodeAndNetName,
} from '../../db/types/member.types';
import { NetEventKeys } from '../types/net.types';
import { ITableNetsData } from '../../db/db.types';
import { NetViewKeys } from '../../client/common/api/types/net.types';
import {
  NET_MESSAGES_MAP, NET_VIEW_MESSAGES_MAP,
} from '../../constants/constants';

const commitChanges = async (user_id: number, date: string) => {
  await execQuery.user.changes.write([user_id, date]);
  const chatId = chatService.getChatIdOfUser(user_id);
  const connectionIds = chatService.getChatConnections(chatId);
  connectionService.sendMessage({ chatId, user_id, index: 0 }, connectionIds);
};

const createMessagesToFacilitator = async (
  event: NetEventKeys,
  user: IMember,
  memberNet: IMemberWithNet,
  date: string,
) => {
  const message = NET_VIEW_MESSAGES_MAP[event]['FACILITATOR'];
  if (!message) return;
  const { user_id, node_id: user_node_id } = user;
  const { node_id: member_node_id } = memberNet;
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
  memberNet: IMemberWithNet,
  date: string,
) => {
  const message = NET_VIEW_MESSAGES_MAP[event]['CIRCLE'];
  if (!message) return;
  const { user_id, node_id: user_node_id } = user;
  const { node_id: member_node_id } = memberNet;
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
  event: NetEventKeys,
  memberNet: IMemberWithNet,
  date: string,
) => {
  const message = NET_VIEW_MESSAGES_MAP[event]['TREE'];
  if (!message) return;
  const { node_id: member_node_id, confirmed } = memberNet;
  if (!confirmed) return;
  const users = await execQuery.net.tree.getMembers([member_node_id]);
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
  event: NetEventKeys,
  memberNet: IMemberWithNet,
  date: string,
) => {
  const {
    node_id: member_node_id,
    parent_node_id,
    confirmed: member_confirmed,
  } = memberNet;
  if (!parent_node_id) return;
  const messageToFacilitator = NET_VIEW_MESSAGES_MAP[event]['FACILITATOR'];
  const messageToCircleMember = NET_VIEW_MESSAGES_MAP[event]['CIRCLE'];
  if (!messageToFacilitator && !messageToCircleMember) return;
  const users = await execQuery.net.circle
    .getMembers([member_node_id, parent_node_id]);
  for (const user of users) {
    const { node_id: user_node_id, confirmed: user_confirmed } = user;
    if (user_node_id === parent_node_id) {
      await createMessagesToFacilitator(event, user, memberNet, date);
    } else if (!member_confirmed) continue;
    else if (!user_confirmed) continue;
    else {
      await cretaeMessagesToCircleMembers(event, user, memberNet,  date);
    }
  }
};

export const createMessages = async (
  event: NetEventKeys,
  memberNet: IMemberWithNet,
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
  const message = format(NET_VIEW_MESSAGES_MAP[event]['CONNECTED'], name);
  for (const user_id of user_ids) {
    await execQuery.net.message.create([
      user_id, null, 'circle', null, message, date,
    ]);
    await commitChanges(user_id, date);
  }
};

export const createMessagesInNet = async (
  event: NetEventKeys,
  netView: NetViewKeys,
  memberNet: IMember & Pick<ITableNetsData, 'name'>,
  date: string,
) => {
  const message = NET_MESSAGES_MAP[event];
  if (!message) return;
  const { user_id, node_id: user_node_id } = memberNet;
  await execQuery.net.message.create([
    user_id,
    user_node_id,
    netView,
    null,
    message,
    date,
  ]);
};
