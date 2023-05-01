import { NetEventKeys } from '../../../client/common/server/types/types';
import { IMember } from '../../../db/types/member.types';
import {
  NET_MESSAGES_MAP, INSTANT_EVENTS,
} from '../../../constants/constants';
import { sendInstantMessage } from './event.messages.instant';
import { commitEvents } from './event.messages.other';

const createMessageToFacilitator = async (
  event: NetEventKeys,
  user: IMember,
  fromMember: IMember,
  date: string,
) => {
  const message = NET_MESSAGES_MAP[event]['FACILITATOR'];
  if (!message) return;
  const { user_id } = user;
  const { node_id: from_node_id, net_id } = fromMember;
  await execQuery.events.create([
    user_id,
    net_id,
    'tree',
    from_node_id,
    event,
    message,
    date,
  ]);
  await commitEvents(user_id, date);
};

const cretaeMessagesToCircleMember = async (
  event: NetEventKeys,
  user: IMember,
  fromMember: IMember,
  date: string,
) => {
  const message = NET_MESSAGES_MAP[event]['CIRCLE'];
  if (!message) return;
  const { user_id, node_id } = user;
  const { node_id: from_node_id, net_id } = fromMember;
  if (INSTANT_EVENTS.includes(event))
    return sendInstantMessage(event, user_id, node_id, 'circle');
  await execQuery.events.create([
    user_id,
    net_id,
    'circle',
    from_node_id,
    event,
    message,
    date,
  ]);
  await commitEvents(user_id, date);
};

export const createMessagesInCircle = async (
  event: NetEventKeys,
  fromMember: IMember,
  date: string,
) => {
  const {
    node_id: member_node_id,
    parent_node_id,
    confirmed: member_confirmed,
  } = fromMember;
  if (!parent_node_id) return;
  const messageToFacilitator = NET_MESSAGES_MAP[event]['FACILITATOR'];
  const messageToCircleMember = NET_MESSAGES_MAP[event]['CIRCLE'];
  if (!messageToFacilitator && !messageToCircleMember) return;
  const users = await execQuery.net.circle
    .getMembers([member_node_id, parent_node_id]);
  for (const user of users) {
    const { node_id: user_node_id, confirmed: user_confirmed } = user;
    if (user_node_id === parent_node_id) {
      await createMessageToFacilitator(event, user, fromMember, date);
    } else if (!member_confirmed) continue;
    else if (!user_confirmed) continue;
    else {
      await cretaeMessagesToCircleMember(event, user, fromMember,  date);
    }
  }
};
