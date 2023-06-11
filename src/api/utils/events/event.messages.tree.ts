import { IMember } from '../../../db/types/member.types';
import { NetEventKeys } from '../../../client/common/server/types/types';
import { NET_MESSAGES_MAP } from '../../../constants/constants';
import { commitEvents } from './event.messages.notify';

export const createMessagesInTree = async (
  event: NetEventKeys,
  fromMember: IMember,
  date: string,
) => {
  const message = NET_MESSAGES_MAP[event]['TREE'];
  if (!message) return;
  const { node_id: from_node_id, net_id, confirmed } = fromMember;
  if (!confirmed) return;
  const users = await execQuery.net.tree.getMembers([from_node_id]);
  for (const { user_id } of users) {
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
  }
};
