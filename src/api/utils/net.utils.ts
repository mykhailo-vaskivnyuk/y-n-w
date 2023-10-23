/* eslint-disable max-lines */
import { IUserNetData } from '../../db/types/member.types';
import { ITransaction } from '../../db/types/types';
import { NetEvent } from '../../services/event/event';
import { HandlerError } from '../../router/errors';
import { updateCountOfMembers } from './nodes.utils';
import { checkVotes } from './vote.utils';
import { tightenNodes } from './tighten.utils';
import { exeWithNetLock } from './utils';
import { removeConnectedAll } from './connected.utils';

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

export const removeMemberFromNet = async (event: NetEvent) => {
  const { user_id, net_id, node_id, parent_node_id, confirmed } = event.member!;
  logger.debug('START REMOVE FROM NET:', net_id);

  // 1 - remove events
  confirmed && await execQuery.events.removeFromNet([user_id, net_id]);

  // 2 - remove connected users in net and subnets
  confirmed && await removeConnectedAll(event);

  // 3 - remove member in net
  logger.debug('MEMBER REMOVE');
  await execQuery.member.remove([user_id, net_id]);

  // 4 - update nodes data in net
  confirmed && await updateCountOfMembers(node_id, -1);

  // 5 - create messages
  logger.debug('CREATE MESSAGES');
  event.messages.create();

  return [parent_node_id, node_id];
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
      await event.commit(notificationService, t);
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
  await event.commit(notificationService, t);
});
