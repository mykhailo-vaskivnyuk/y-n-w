import { removeConnected } from './net.utils';
import { createMessages } from './messages.create.utils';

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
  const [parent_member] = await execQuery.member.get([parent_node_id]);

  const { user_id: parentUserId = null } = parent_member || {};
  if (parent_member) {
    await removeConnected('LEAVE_DISVOTE', parent_member, date);
    await execQuery.member.data
      .removeFromCircle([parentUserId!, parent_node_id]);
    await execQuery.user.changes
      .removeFromCircle([parentUserId!, parent_node_id]);
  }

  const [member] = await execQuery.member.get([node_id]);
  const { user_id, net_id } = member!;
  await removeConnected('LEAVE_VOTE', member!, date);
  await execQuery.member.data.removeFromTree([user_id, node_id]);
  await execQuery.user.changes.removeFromTree([user_id, node_id]);

  await execQuery.member.moveToTmp([node_id, parent_node_id]);
  await execQuery.user.changes.moveToTmp([node_id, parent_node_id]);
  await execQuery.member.removeVoted([node_id, parent_node_id]);

  await execQuery.member.change([
    node_id,
    parent_node_id,
    user_id,
    parentUserId,
    net_id,
  ]);
  await execQuery.member.moveFromTmp([node_id, parent_node_id]);
  await execQuery.member.removeFromTmp([node_id, parent_node_id]);

  await execQuery.user.changes.changeNodes([
    node_id,
    parent_node_id,
    user_id,
    parentUserId,
  ]);
  await execQuery.user.changes.moveFromTmp([node_id, parent_node_id]);
  await execQuery.user.changes.removeFromTmp([node_id, parent_node_id]);

  !parentUserId && await execQuery.node.updateCountOfMembers([node_id, -1]);

  createMessages('LEAVE_VOTE', member!, date);
  parent_member && createMessages('LEAVE_DISVOTE', parent_member, date);

  const voteMemeber = {
    ...member!,
    node_id: parent_node_id,
    parent_node_id: parent_member?.parent_node_id || null,
  };
  await createMessages('CONNECT_VOTE', voteMemeber, date);


  if (!parent_member) return;

  const disvoteMember = {
    ...parent_member,
    node_id,
    parent_node_id,
  };
  createMessages('CONNECT_DISVOTE', disvoteMember, date);
};
