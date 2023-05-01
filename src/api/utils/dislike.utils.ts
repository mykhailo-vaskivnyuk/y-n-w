import { removeNetUser } from './net.utils';

export const checkDislikes = async (
  parent_node_id: number,
): Promise<number[]> => {
  const members = await execQuery.net.branch.getDislikes([parent_node_id]);
  const count = members.length;
  if (!count) return [];
  const [memberWithMaxDislikes] = members;
  const { dislike_count } = memberWithMaxDislikes!;
  const disliked = Math.ceil(dislike_count / (count - dislike_count)) > 1;
  if (!disliked) return [];
  const { user_id, net_id } = memberWithMaxDislikes!;
  const nodesToArrange = await removeNetUser('DISLIKE', user_id, net_id);
  return nodesToArrange;
};
