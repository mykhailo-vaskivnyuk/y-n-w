/* eslint-disable max-lines */
import { NetEventKeys } from '../../client/common/server/types/types';
import { ITransaction } from '../../db/types/types';
import { IMember } from '../types/member.types';
import { NetEvent } from '../event/event';
import { exeWithNetLock } from '../utils/utils';

export class NetArrange {
  removeMemberFromNet(event_type: NetEventKeys, member: IMember) {
    const { net_id } = member;
    exeWithNetLock(net_id, async (t) => {
      const event = new NetEvent(net_id, event_type, member);
      const net = new NetArrange();
      try {
        const nodesToArrange =
          await net.removeMemberFromNetAndSubnets(event);
        await net.arrangeNodes(t, event, nodesToArrange);
      } finally {
        await event.commit(notificationService, t);
      }
    });
  }

  async removeMemberFromNetAndSubnets(event: NetEvent) {
    const { event_type, net_id: root_net_id, member } = event;
    const { user_id } = member!;

    do {
      const [member] = await execQuery
        .user.netData.getFurthestSubnet([user_id, root_net_id]);
      if (!member) break;
      await this.removeMemberFromNet(event_type, member);
    } while (true);

    const net = new NetArrange();
    return net.removeMember(event);
  }

  async removeMember(event: NetEvent) {
    const {
      user_id,
      net_id,
      node_id,
      parent_node_id,
      confirmed,
    } = event.member!;
    logger.debug('START REMOVE FROM NET:', net_id);

    // 1 - remove events
    confirmed && await execQuery.events.removeFromNet([user_id, net_id]);

    // 2 - remove connected users in net and subnets
    confirmed && await this.removeConnectedAll(event);

    // 3 - remove member in net
    logger.debug('MEMBER REMOVE');
    await execQuery.member.remove([user_id, net_id]);

    // 4 - update nodes data in net
    confirmed && await this.updateCountOfMembers(node_id, -1);

    // 5 - create messages
    logger.debug('CREATE MESSAGES');
    event.messages.create();

    return [parent_node_id, node_id];
  }

  async removeConnectedAll(event: NetEvent) {
    const { node_id } = event.member!;
    const users = await execQuery.member.getConnected([node_id]);
    for (const { user_id } of users) {
      await this.removeConnectedMember(event, user_id);
    }
  }

  async removeConnectedMember(event: NetEvent, user_id: number) {
    const { net_id } = event;
    await execQuery.member.remove([user_id, net_id]);
    await event.messages.createToConnected(user_id);
  }

  async updateCountOfMembers(node_id: number, addCount = 1): Promise<void> {
    const [node] =
      await execQuery.node.updateCountOfMembers([node_id, addCount]);
    const { parent_node_id, count_of_members } = node!;
    if (!count_of_members) {
      await execQuery.node.tree.remove([node_id]);
    }
    if (!parent_node_id) return;
    return this.updateCountOfMembers(parent_node_id, addCount);
  }

  async arrangeNodes(
    t: ITransaction,
    event: NetEvent,
    [...nodesToArrange]: (number | null)[] = [],
  ) {
    while (nodesToArrange.length) {
      const node_id = nodesToArrange.shift();
      if (!node_id) continue;
      const isTighten = await this.tightenNodes(t, node_id);
      if (isTighten) continue;
      const newNodesToArrange =
        await this.checkDislikes(event, node_id);
      nodesToArrange = [...newNodesToArrange, ...nodesToArrange];
      if (newNodesToArrange.length) continue;
      await this.checkVotes(event, node_id);
    }
  }

  async tightenNodes(t: ITransaction, node_id: number) {
    const [node] = await execQuery.node.getIfEmpty([node_id]);
    if (!node) return false;
    const {
      node_level,
      parent_node_id,
      net_id,
      node_position,
      count_of_members,
    } = node;
    if (!count_of_members) {
      if (parent_node_id) return true;
      await execQuery.node.remove([node_id]);
      await this.updateCountOfNets(t, net_id, -1);
      await t.execQuery.net.remove([net_id]);
      return true;
    }
    const [nodeWithMaxCount] = await execQuery
      .net.tree.getNodes([node_id]);
    if (!nodeWithMaxCount) return false;
    const {
      count_of_members: childCount,
      node_id: childNodeId,
    } = nodeWithMaxCount;
    if (childCount !== count_of_members) return false;
    await execQuery.node.move([
      childNodeId,
      node_level,
      parent_node_id,
      node_position,
      count_of_members,
    ]);
    if (parent_node_id) {
      this.changeLevelFromNode(childNodeId);
    } else {
      await execQuery.node.changeLevelAll([net_id]);
    }
    await execQuery.node.tree.remove([node_id]);
    await execQuery.node.remove([node_id]);
    return true;
  }

  async updateCountOfNets(
    t: ITransaction,
    net_id: number,
    addCount = 1,
  ): Promise<void> {
    const [net] = await t.execQuery
      .net.updateCountOfNets([net_id, addCount]);
    const { parent_net_id } = net!;
    if (!parent_net_id) return;
    await this.updateCountOfNets(t, parent_net_id, addCount);
  }

  async changeLevelFromNode(parentNodeId: number) {
    for (let node_position = 0; node_position < 6; node_position++) {
      const [node] = await execQuery
        .node.getChild([parentNodeId, node_position]);
      const { node_id, count_of_members } = node!;
      await execQuery.node.changeLevel([node_id]);
      if (count_of_members) await this.changeLevelFromNode(node_id);
    }
  }

  async checkDislikes(
    event: NetEvent,
    parent_node_id: number,
  ): Promise<(number | null)[]> {
    const members = await execQuery.net.branch.getDislikes([parent_node_id]);
    const count = members.length;
    if (!count) return [];
    const [memberWithMaxDislikes] = members;
    const { dislike_count } = memberWithMaxDislikes!;
    const disliked = Math.ceil(dislike_count / (count - dislike_count)) > 1;
    if (!disliked) return [];
    const { node_id } = memberWithMaxDislikes!;
    const [member] = await execQuery.member.get([node_id]);
    const childEvent = event.createChild('DISLIKE_DISCONNECT', member);
    return this.removeMemberFromNetAndSubnets(childEvent);
  }

  async checkVotes(event: NetEvent, parent_node_id: number) {
    const members = await execQuery.net.branch.getVotes([parent_node_id]);
    const count = members.length;
    if (!count) return false;
    const [memberWithMaxVotes] = members;
    const { vote_count } = memberWithMaxVotes!;
    const isVoted = vote_count === count;
    if (!isVoted) return false;
    const { node_id } = memberWithMaxVotes!;
    await this.voteNetUser(event, node_id, parent_node_id);
    return true;
  }

  async voteNetUser(
    event: NetEvent,
    node_id: number,
    parent_node_id: number,
  ) {
    await execQuery.member.invite.removeAll([node_id]);
    await execQuery.member.invite.removeAll([parent_node_id]);

    const [member] = await execQuery.member.get([node_id]);
    const {
      user_id,
      node_level,
      net_id,
      node_position,
      count_of_members,
    } = member!;
    const eventVote = event.createChild('LEAVE_VOTE', member);
    await this.removeConnectedAll(eventVote);
    await execQuery.member.data.removeFromTree([node_id]);
    await execQuery.events.removeFromTree([user_id!, net_id]);

    const [parent_member] = await execQuery.member.get([parent_node_id]);
    const {
      user_id: parentUserId,
      node_level: parentNodeLevel,
      parent_node_id: parentParentNodeId,
      node_position: parentNodePosition,
      count_of_members: parentCountOfMembers,
    } = parent_member!;

    const eventDisvote = event.createChild('LEAVE_DISVOTE', parent_member);
    if (parentUserId) {
      await this.removeConnectedAll(eventDisvote);
      await execQuery.member
        .data.removeFromCircle([parentUserId, parent_node_id]);
      await execQuery
        .events.removeFromCircle([parentUserId, net_id]);
    }

    await execQuery.node.move([
      node_id,
      parentNodeLevel,
      parentParentNodeId,
      parentNodePosition,
      parentCountOfMembers,
    ]);

    const newCountOfMembers = parentUserId ?
      count_of_members :
      count_of_members - 1;

    await execQuery.node.move([
      parent_node_id,
      node_level,
      node_id,
      node_position,
      newCountOfMembers,
    ]);

    await execQuery.node.tree.replace([parent_node_id, node_id]);
    if (!newCountOfMembers) await execQuery.node.tree.remove([parent_node_id]);

    await eventVote.messages.create();
    parentUserId && await eventDisvote.messages.create();

    const voteMemeber = {
      ...member!,
      node_id: parent_node_id,
      parent_node_id: parent_member?.parent_node_id || null,
    };
    await event.createChild('CONNECT_VOTE', voteMemeber).messages.create();

    if (!parentUserId) return;

    const disvoteMember = {
      ...parent_member!,
      node_id,
      parent_node_id,
    };
    await event.createChild('CONNECT_DISVOTE', disvoteMember).messages.create();
  }
}
