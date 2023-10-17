import { IMember } from '../../../db/types/member.types';
import { NetEvent } from '../../../services/event/event';
import { NET_MESSAGES_MAP } from '../../../constants/constants';

export const createMessagesInTree = async (
  event: NetEvent,
  from: IMember,
) => {
  const { event_type } = event;
  const message = NET_MESSAGES_MAP[event_type]['TREE'];
  if (!message) return;
  const { node_id: from_node_id, confirmed } = from;
  if (!confirmed) return;
  const members = await execQuery.net.tree.getMembers([from_node_id]);
  for (const { user_id } of members) {
    event.addEvent({ user_id, net_view: 'circle', from_node_id, message });
  }
};
