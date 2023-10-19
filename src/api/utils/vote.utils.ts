/* eslint-disable max-lines */
import { IMember } from '../../db/types/member.types';
import { NetEvent } from '../../services/event/event';
import { removeConnected } from './net.utils';

export const checkVotes = async (event: NetEvent, parent_node_id: number) => {
  const members = await execQuery.net.branch.getVotes([parent_node_id]);
  const count = members.length;
  if (!count) return false;
  const [memberWithMaxVotes] = members;
  const { vote_count } = memberWithMaxVotes!;
  const isVoted = vote_count === count;
  if (!isVoted) return false;
  const { node_id } = memberWithMaxVotes!;
  await voteNetUser(event, node_id, parent_node_id);
  return true;
};

export const voteNetUser = async (
  event: NetEvent,
  node_id: number,
  parent_node_id: number,
) => {
  await execQuery.member.invite.removeAll([node_id]);
  await execQuery.member.invite.removeAll([parent_node_id]);

  const [member] = await execQuery.member.get([node_id]) as IMember[];
  const {
    user_id,
    node_level,
    net_id,
    node_position,
    count_of_members,
  } = member!;
  await removeConnected(event.createChild('LEAVE_VOTE'), member!);
  await execQuery.member.data.removeFromTree([node_id]);
  await execQuery.events.removeFromTree([user_id!, net_id]);

  const [parent_member] = await execQuery
    .member.get([parent_node_id]) as IMember[];
  const {
    user_id: parentUserId,
    node_level: parentNodeLevel,
    parent_node_id: parentParentNodeId,
    node_position: parentNodePosition,
    count_of_members: parentCountOfMembers
  } = parent_member!;

  if (parentUserId) {
    await removeConnected(event.createChild('LEAVE_DISVOTE'), parent_member!);
    await execQuery.member
      .data.removeFromCircle([parentUserId!, parent_node_id]);
    await execQuery
      .events.removeFromCircle([parentUserId!, net_id]);
  }

  await execQuery.node.move([
    node_id,
    parentNodeLevel,
    parentParentNodeId,
    parentNodePosition,
    parentCountOfMembers
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

  await event.createChild('LEAVE_VOTE').messages.create(member!);
  parentUserId && await event.createChild('LEAVE_DISVOTE')
    .messages.create(parent_member!);

  const voteMemeber = {
    ...member!,
    node_id: parent_node_id,
    parent_node_id: parent_member?.parent_node_id || null,
  };
  await event.createChild('CONNECT_VOTE').messages.create(voteMemeber);

  if (!parentUserId) return;

  const disvoteMember = {
    ...parent_member!,
    node_id,
    parent_node_id,
  };
  await event.createChild('CONNECT_DISVOTE').messages.create(disvoteMember);
};
