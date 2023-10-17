import { NetEvent } from '../../../services/event/event';
import { IMember } from '../../../db/types/member.types';
import {
  NET_MESSAGES_MAP, INSTANT_EVENTS,
} from '../../../constants/constants';

const createMessageToFacilitator = (
  event: NetEvent,
  user: IMember,
  from: IMember,
) => {
  const { event_type } = event;
  const message = NET_MESSAGES_MAP[event_type]['FACILITATOR'];
  if (!message) return [];
  const { user_id } = user;
  const { node_id: from_node_id } = from;
  event.addEvent({ user_id, net_view: 'tree', from_node_id, message });
};

const cretaeMessagesToCircleMember = (
  event: NetEvent,
  user: IMember,
  from: IMember,
) => {
  const { event_type } = event;
  const message = NET_MESSAGES_MAP[event_type]['CIRCLE'];
  if (!message) return;
  const { user_id } = user;
  const { node_id: from_node_id, net_id } = from;
  if (INSTANT_EVENTS.includes(event_type)) {
    notificationService.addEvent({
      event_type,
      user_id,
      net_id,
      net_view: 'circle',
    });
  } else {
    event.addEvent({ user_id, net_view: 'circle', from_node_id, message });
  }
};

export const createMessagesInCircle = async (
  event: NetEvent,
  from: IMember,
) => {
  const { event_type } = event;
  const {
    node_id: member_node_id,
    parent_node_id,
    confirmed: member_confirmed,
  } = from;
  if (!parent_node_id) return;
  const messageToFacilitator = NET_MESSAGES_MAP[event_type]['FACILITATOR'];
  const messageToCircleMember = NET_MESSAGES_MAP[event_type]['CIRCLE'];
  if (!messageToFacilitator && !messageToCircleMember) return;
  const users = await execQuery.net.circle
    .getMembers([member_node_id, parent_node_id]);
  for (const user of users) {
    const { node_id: user_node_id, confirmed: user_confirmed } = user;
    if (user_node_id === parent_node_id) {
      createMessageToFacilitator(event, user, from);
    } else if (!member_confirmed) continue;
    else if (!user_confirmed) continue;
    else {
      cretaeMessagesToCircleMember(event, user, from);
    }
  }
};
