import { removeConnected } from './net.utils';
import { createEventMessages } from './events/event.messages.create';

export const checkVotes = async (parent_node_id: number) => {
  const members = await execQuery.net.circle.getVotes([parent_node_id]);
  const count = members.length;
  if (!count) return null;
  const [memberWithMaxVotes] = members;
  const { vote_count } = memberWithMaxVotes!;
  const isVoted = vote_count === count;
  if (!isVoted) return false;
  const { node_id } = memberWithMaxVotes!;
  await voteNetUser(node_id, parent_node_id);
  return true;
};

export const voteNetUser = async (node_id: number, parent_node_id: number) => {
  const date = new Date().toUTCString();

  const [member] = await execQuery.member.get([node_id]);
  const { user_id, net_id } = member!;
  await execQuery.member.invite.removeAll([node_id]);
  await execQuery.member.invite.removeAll([parent_node_id]);
  await removeConnected('LEAVE_VOTE', member!, date);

  await execQuery.member.data.removeFromTree([user_id, node_id]);
  await execQuery.events.removeFromTree([user_id, net_id]);

  const [parent_member] = await execQuery.member.get([parent_node_id]);

  if (parent_member) {
    const { user_id: parentUserId } = parent_member;
    await removeConnected('LEAVE_DISVOTE', parent_member, date);
    await execQuery.member.data
      .removeFromCircle([parentUserId!, parent_node_id]);
    await execQuery.events
      .removeFromCircle([parentUserId!, net_id]);
  }

  if (parent_member) {
    await execQuery.member.copyToTmp([parent_node_id]);
    const [tmpUser] = await execQuery.user.copy([user_id]);
    await execQuery.member.copy([parent_node_id, node_id, tmpUser!.user_id]);
    await execQuery.member.replace([node_id, parent_node_id]);
    await execQuery.member.changeUser([parent_node_id, user_id]);
    await execQuery.member.removeFromTmp([parent_node_id]);
    await execQuery.user.remove([tmpUser!.user_id]);
  } else {
    await execQuery.member.changeNode([node_id, parent_node_id]);
  }

  !parent_member && await execQuery.node.updateCountOfMembers([node_id, -1]);

  createEventMessages('LEAVE_VOTE', member!, date);
  parent_member && createEventMessages('LEAVE_DISVOTE', parent_member, date);

  const voteMemeber = {
    ...member!,
    node_id: parent_node_id,
    parent_node_id: parent_member?.parent_node_id || null,
  };
  await createEventMessages('CONNECT_VOTE', voteMemeber, date);


  if (!parent_member) return;

  const disvoteMember = {
    ...parent_member,
    node_id,
    parent_node_id,
  };
  createEventMessages('CONNECT_DISVOTE', disvoteMember, date);
};
