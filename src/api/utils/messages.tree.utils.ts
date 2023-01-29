import { IMember } from '../../db/types/member.types';
import { NetEventKeys } from '../types/net.types';
import { NET_MESSAGES_MAP } from '../../constants/constants';
import { commitChanges } from './messages.utils';

export const createMessagesInTree = async (
  event: NetEventKeys,
  memberNet: IMember,
  date: string,
) => {
  const message = NET_MESSAGES_MAP[event]['TREE'];
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
