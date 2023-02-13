import { IMember } from '../../../db/types/member.types';
import { NetEventKeys } from '../../types/net.types';
import { NET_MESSAGES_MAP } from '../../../constants/constants';
import { commitChanges } from './event.messages.other';

export const createMessagesInTree = async (
  event: NetEventKeys,
  memberNet: IMember,
  date: string,
) => {
  const message = NET_MESSAGES_MAP[event]['TREE'];
  if (!message) return;
  const { node_id: from_node_id, net_id, confirmed } = memberNet;
  if (!confirmed) return;
  const users = await execQuery.net.tree.getMembers([from_node_id]);
  for (const { user_id } of users) {
    await execQuery.net.message.create([
      user_id,
      net_id,
      'circle',
      from_node_id,
      message,
      date,
    ]);
    await commitChanges(user_id, date);
  }
};
