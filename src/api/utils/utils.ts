/* eslint-disable max-lines */
import { IUserNetData } from '../../db/types/member.types';
import { NetEvent } from '../../services/event/event';
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
  event: NetEvent, parent_node_id: number,
): Promise<(number | null)[]> => {
  const members = await execQuery.net.branch.getDislikes([parent_node_id]);
  const count = members.length;
  if (!count) return [];
  const [memberWithMaxDislikes] = members;
  const { dislike_count, user_id } = memberWithMaxDislikes!;
  const disliked = Math.ceil(dislike_count / (count - dislike_count)) > 1;
  if (!disliked) return [];
  return removeMemberFromNetAndSubnets(
    event.createChild('DISLIKE_DISCONNECT'), user_id);
};

export const arrangeNodes = async (
  t: ITransaction,
  event: NetEvent,
  [...nodesToArrange]: (number | null)[] = [],
) => {
  while (nodesToArrange.length) {
    const node_id = nodesToArrange.shift();
    if (!node_id) continue;
    const isTighten = await tightenNodes(t, node_id);
    if (isTighten) continue;
    const newNodesToArrange =
      await checkDislikes(event, node_id);
    nodesToArrange = [...newNodesToArrange, ...nodesToArrange];
    if (newNodesToArrange.length) continue;
    await checkVotes(event, node_id);
  }
};

export const removeMemberFromNetAndSubnets = async (
  event: NetEvent,
  user_id: number,
) => {
  const { event_type, net_id: root_net_id } = event;
  let userNetData: IUserNetData | undefined;
  do {
    [userNetData] = await execQuery
      .user.netData.getFurthestNet([user_id, root_net_id]);
    if (!userNetData) {
      if (!root_net_id) return [];
      throw new HandlerError('NOT_FOUND');
    }
    const { net_id } = userNetData;
    if (net_id === root_net_id) break;
    // eslint-disable-next-line no-loop-func
    await exeWithNetLock(net_id, async (t) => {
      const event = new NetEvent(net_id, event_type, userNetData);
      const nodesToArrange = await removeMemberFromNet(event);
      await arrangeNodes(t, event, nodesToArrange);
      await event.write(t);
    });
  } while (userNetData);

  event.member = userNetData;
  return removeMemberFromNet(event);
};

export const removeMember = (
  event: NetEvent,
  user_id: number,
) => exeWithNetLock(event.net_id, async (t) => {
  const nodesToArrange =
    await removeMemberFromNetAndSubnets(event, user_id);
  await arrangeNodes(t, event, nodesToArrange);
  await event.write(t);
});
