/* eslint-disable max-lines */
import { NetEventKeys } from '../../client/common/server/types/types';
import { ITransaction } from '../../db/types/types';
import { IMember } from '../types/member.types';
import { NetEvent } from '../event/event';
import { Member } from '../member/member';
import { exeWithNetLock } from '../utils/utils';

export class NetArrange {
  constructor(private t: ITransaction) {}

  static async removeMemberFromNet(event_type: NetEventKeys, member: IMember) {
    const { net_id, node_id, user_id } = member;
    let event!: NetEvent;
    await exeWithNetLock(net_id, async (t) => {
      const member = await new Member().init(user_id, node_id);
      event = new NetEvent(net_id, event_type, member.get());
      const net = new NetArrange(t);
      const nodesToArrange =
        await net.removeMemberFromNetAndSubnets(event);
      await net.arrangeNodes(event, nodesToArrange);
      await event.commit(t);
    });
    event?.send();
  }

  async removeMemberFromNetAndSubnets(event: NetEvent) {
    const { event_type, net_id: root_net_id, member } = event;
    const { user_id } = member!;

    do {
      const [member] = await execQuery
        .user.netData.getFurthestSubnet([user_id, root_net_id]);
      if (!member) break;
      await NetArrange.removeMemberFromNet(event_type, member);
    } while (true);

    return this.removeMember(event);
  }

  async removeMember(event: NetEvent) {
    const { t } = this;
    const {
      user_id,
      net_id,
      node_id,
      parent_node_id,
      confirmed,
    } = event.member!;
    logger.debug('START REMOVE FROM NET:', net_id);

    // 1 - remove events
    confirmed && await t.execQuery.events.removeFromNet([user_id, net_id]);

    // 2 - remove connected users in net and subnets
    confirmed && await this.removeConnectedAll(event);

    // 3 - remove member in net
    logger.debug('MEMBER REMOVE');
    await t.execQuery.member.removeByNet([user_id, net_id]);

    // 4 - update nodes data in net
    confirmed && await this.updateCountOfMembers(node_id, -1);

    // 5 - create messages
    logger.debug('CREATE MESSAGES');
    await event.messages.create(t);

    return [parent_node_id, node_id];
  }

  async removeConnectedAll(event: NetEvent) {
    const { node_id } = event.member!;
    const users = await this.t.execQuery.member.getConnected([node_id]);
    for (const { user_id } of users) {
      await this.removeConnectedMember(event, user_id);
    }
  }

  async removeConnectedMember(event: NetEvent, user_id: number) {
    const { net_id } = event;
    await this.t.execQuery.member.removeByNet([user_id, net_id]);
    await event.messages.createToConnected(user_id);
  }

  async updateCountOfMembers(node_id: number, addCount = 1): Promise<void> {
    const [node] =
      await this.t.execQuery.node.updateCountOfMembers([node_id, addCount]);
    const { parent_node_id, count_of_members } = node!;
    if (!count_of_members) {
      await this.t.execQuery.node.tree.remove([node_id]);
    }
    if (!parent_node_id) return;
    return this.updateCountOfMembers(parent_node_id, addCount);
  }

  async arrangeNodes(
    event: NetEvent,
    [...nodesToArrange]: (number | null)[] = [],
  ) {
    while (nodesToArrange.length) {
      const node_id = nodesToArrange.shift();
      if (!node_id) continue;
      const removed = await this.tightenNodes(node_id, event);
      if (removed) {
        if (!removed.length) continue;
        let i = -1;
        for (const node_id of [...nodesToArrange]) {
          i++;
          if (!node_id) continue;
          if (!removed.includes(node_id)) continue;
          nodesToArrange.splice(i--, 1);
        }
        event.messages.removeFromNodes(removed);
        continue;
      }
      const newNodesToArrange =
        await this.checkDislikes(event, node_id);
      nodesToArrange = [...newNodesToArrange, ...nodesToArrange];
      if (newNodesToArrange.length) continue;
      await this.checkVotes(event, node_id);
    }
  }

  async tightenNodes(
    node_id: number,
    event: NetEvent,
  ): Promise<number[] | undefined> {
    const { t } = this;
    const [node] = await t.execQuery.node.getIfEmpty([node_id]);
    if (!node) return;
    const {
      parent_node_id,
      net_id,
      node_position,
      count_of_members,
    } = node;
    if (!count_of_members) {
      if (parent_node_id) return [];
      await t.execQuery.node.remove([node_id]);
      await this.updateCountOfNets(net_id, -1);
      await t.execQuery.net.remove([net_id]);
      return [];
    }
    const [nodeWithMaxCount] = await t.execQuery
      .net.tree.getNodes([node_id]);
    if (!nodeWithMaxCount) return;
    const {
      count_of_members: childCount,
      node_id: childNodeId,
    } = nodeWithMaxCount;
    if (childCount !== count_of_members) return;
    await t.execQuery.node.move([
      childNodeId,
      parent_node_id,
      node_position,
      count_of_members,
    ]);
    if (parent_node_id) {
      await this.changeLevelFromNode(childNodeId);
    } else {
      await t.execQuery.node.changeLevelAll([net_id]);
    }
    const nodes = await t.execQuery.node.tree.remove([node_id]);
    await t.execQuery.node.remove([node_id]);
    const nodeIds = nodes.map(({ node_id }) => node_id);
    nodeIds.push(node_id);
    const [tightenMember] = await t.execQuery.member.get([childNodeId]);
    const tightenEvent = event.createChild('TIGHTEN', tightenMember!);
    await tightenEvent.messages.create(t);
    return nodeIds;
  }

  async updateCountOfNets(
    net_id: number,
    addCount = 1,
  ): Promise<void> {
    const [net] = await this.t.execQuery
      .net.updateCountOfNets([net_id, addCount]);
    const { parent_net_id } = net!;
    if (!parent_net_id) return;
    await this.updateCountOfNets(parent_net_id, addCount);
  }

  async changeLevelFromNode(nodeId: number) {
    const [node] = await this.t.execQuery.node.changeLevel([nodeId]);
    if (!node!.count_of_members) return;
    for (let node_position = 0; node_position < 6; node_position++) {
      const [childNode] = await this.t.execQuery
        .node.getChild([nodeId, node_position]);
      const { node_id } = childNode!;
      await this.changeLevelFromNode(node_id);
    }
  }

  async checkDislikes(
    event: NetEvent,
    parent_node_id: number,
  ): Promise<(number | null)[]> {
    const members = await this.t.execQuery
      .net.branch.getDislikes([parent_node_id]);
    const count = members.length;
    if (!count) return [];
    const [memberWithMaxDislikes] = members;
    const { dislike_count } = memberWithMaxDislikes!;
    const disliked = Math.ceil(dislike_count / (count - dislike_count)) > 1;
    if (!disliked) return [];
    const { node_id } = memberWithMaxDislikes!;
    const [member] = await this.t.execQuery.member.get([node_id]);
    const childEvent = event.createChild('DISLIKE_DISCONNECT', member);
    return this.removeMemberFromNetAndSubnets(childEvent);
  }

  async checkVotes(event: NetEvent, parent_node_id: number) {
    const members = await this.t.execQuery
      .net.branch.getVotes([parent_node_id]);
    const count = members.length;
    if (count < 2) return false;
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
    const { t } = this;
    const [vote_member] = await t.execQuery.member.get([node_id]);
    const [disvote_member] = await t.execQuery
      .member.get([parent_node_id]);
    const { user_id, net_id, count_of_members } = vote_member!;
    const { user_id: parentUserId } = disvote_member || {};

    /* vote */
    /* create event */
    const eventVote = event.createChild('LEAVE_VOTE', vote_member);
    /* remove invites */
    await t.execQuery.member.invite.removeAll([node_id]);
    /* remove connected */
    await this.removeConnectedAll(eventVote);
    /* remove member_to_member data in tree */
    await t.execQuery.member.data.removeFromTree([node_id]);
    /* remove all events in net*/
    await t.execQuery.events.removeFromNet([user_id!, net_id]);
    /* create messages */
    await eventVote.messages.create(t);

    /* disvote */
    if (parentUserId) {
      /* create event */
      const eventDisvote = event.createChild('LEAVE_DISVOTE', disvote_member);
      /* remove invites */
      await t.execQuery.member.invite.removeAll([parent_node_id]);
      /* remove connected */
      await this.removeConnectedAll(eventDisvote);
      /* remove member_to_member data in circle */
      await t.execQuery.member
        .data.removeFromCircle([parentUserId, parent_node_id]);
      /* remove all events in net*/
      await t.execQuery
        .events.removeFromNet([parentUserId, net_id]);
      /* create messages */
      await eventDisvote.messages.create(t);
    }

    /* remove all votes*/
    await t.execQuery.member.data.clearVotes([parent_node_id]);
    /* replace member_to_member data */
    if (!parentUserId) {
      await t.execQuery.member.create([parent_node_id, user_id]);
      await t.execQuery.member.confirm([parent_node_id]);
    }
    await t.execQuery.member.data.replace([node_id, parent_node_id]);
    /* replace users */
    if (parentUserId) {
      await t.execQuery
        .member.replace([node_id, parent_node_id, user_id, parentUserId]);
    } else {
      await t.execQuery.member.remove([node_id]);
    }

    /* correct count_of_members */
    if (!parentUserId) {
      await t.execQuery.node.updateCountOfMembers([node_id, -1]);
      if (count_of_members - 1) return;
      await t.execQuery.node.tree.remove([node_id]);
    }

    /* create messages */
    const voteMemeber = {
      ...vote_member!,
      node_id: parent_node_id,
      parent_node_id: null,
      ...disvote_member,
      user_id,
    };
    await event
      .createChild('CONNECT_VOTE', voteMemeber)
      .messages.create(t);

    if (!parentUserId) return;

    const disvoteMember = {
      ...vote_member!,
      user_id: parentUserId,
    };
    await event
      .createChild('CONNECT_DISVOTE', disvoteMember)
      .messages.create(t);
  }
}
