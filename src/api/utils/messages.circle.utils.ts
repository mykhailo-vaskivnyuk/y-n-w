import { NetEventKeys } from '../types/net.types';
import {
  IMember, IMemberWithNet
} from '../../db/types/member.types';
import {
  NET_MESSAGES_MAP, SEND_INSTANT_MESSAGE,
} from '../../constants/constants';
import { commitChanges, sendInstantMessage } from './messages.utils';

const createMessageToFacilitator = async (
  event: NetEventKeys,
  user: IMember,
  memberNet: IMemberWithNet,
  date: string,
) => {
  const message = NET_MESSAGES_MAP[event]['FACILITATOR'];
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

const cretaeMessagesToCircleMember = async (
  event: NetEventKeys,
  user: IMember,
  memberNet: IMemberWithNet,
  date: string,
) => {
  const message = NET_MESSAGES_MAP[event]['CIRCLE'];
  if (!message) return;
  const { user_id, node_id: user_node_id } = user;
  const { node_id: member_node_id } = memberNet;
  if (SEND_INSTANT_MESSAGE.includes(event))
    return await sendInstantMessage(user_id, user_node_id, 'circle');
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

export const createMessagesInCircle = async (
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
  const messageToFacilitator = NET_MESSAGES_MAP[event]['FACILITATOR'];
  const messageToCircleMember = NET_MESSAGES_MAP[event]['CIRCLE'];
  if (!messageToFacilitator && !messageToCircleMember) return;
  const users = await execQuery.net.circle
    .getMembers([member_node_id, parent_node_id]);
  for (const user of users) {
    const { node_id: user_node_id, confirmed: user_confirmed } = user;
    if (user_node_id === parent_node_id) {
      await createMessageToFacilitator(event, user, memberNet, date);
    } else if (!member_confirmed) continue;
    else if (!user_confirmed) continue;
    else {
      await cretaeMessagesToCircleMember(event, user, memberNet,  date);
    }
  }
};
