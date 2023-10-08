/* eslint-disable max-lines */
import { IUserNetData } from '../../db/types/member.types';
import { NetEventKeys } from '../../client/common/server/types/types';
import { ITransaction } from '../../db/types/types';
import { HandlerError } from '../../router/errors';
import { removeMemberFromNet } from './net.utils';
import { checkVotes } from './vote.utils';
import { tightenNodes } from './tighten.utils';

export const exeWithNetLock =
  async <T>(net_id: number | null, func: (t: ITransaction) => T) => {
    const t = await startTransaction();
    try {
      if (net_id) await t.execQuery.net.lock([net_id]);
      const result = await func(t);
      await t.commit();
      return result;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

export const checkDislikes = async (
  parent_node_id: number,
): Promise<(number | null)[]> => {
  const members = await execQuery.net.branch.getDislikes([parent_node_id]);
  const count = members.length;
  if (!count) return [];
  const [memberWithMaxDislikes] = members;
  const { dislike_count, user_id, net_id } = memberWithMaxDislikes!;
  const disliked = Math.ceil(dislike_count / (count - dislike_count)) > 1;
  if (!disliked) return [];
  const event = 'DISLIKE';
  return removeMemberFromNetAndSubnets(event, user_id, net_id);
};

export const arrangeNodes = async (
  t: ITransaction,
  [...nodesToArrange]: (number | null)[] = [],
) => {
  while (nodesToArrange.length) {
    const node_id = nodesToArrange.shift();
    if (!node_id) continue;
    const isTighten = await tightenNodes(t, node_id);
    if (isTighten) continue;
    const newNodesToArrange = await checkDislikes(node_id);
    nodesToArrange = [...newNodesToArrange, ...nodesToArrange];
    await checkVotes(node_id);
  }
};

export const removeMemberFromNetAndSubnets = async (
  event: NetEventKeys,
  user_id: number,
  root_net_id: number | null,
  eventDate?: string,
) => {
  const date = eventDate || new Date().toUTCString();
  let userNetData: IUserNetData | undefined;
  do {
    [userNetData] = await execQuery
      .user.netData.getFurthestNet([user_id, root_net_id]);
    if (!userNetData) {
      if (root_net_id) throw new HandlerError('NOT_FOUND');
      return [];
    }
    const { net_id } = userNetData;
    if (net_id === root_net_id) break;
    // eslint-disable-next-line no-loop-func
    await exeWithNetLock(net_id, async (t) =>
      removeMemberFromNet(event, userNetData!, date)
        .then((nodesToArrange) => arrangeNodes(t, nodesToArrange))
    );

  } while (userNetData);

  return removeMemberFromNet(event, userNetData, date);
};

export const removeMember = async (
  event: NetEventKeys,
  user_id: number,
  net_id: number | null = null,
) => {
  const date = new Date().toUTCString();
  await exeWithNetLock(net_id, async (t) => {
    await removeMemberFromNetAndSubnets(event, user_id, net_id, date)
      .then((nodesToArrange) => arrangeNodes(t, nodesToArrange));
  });
};
