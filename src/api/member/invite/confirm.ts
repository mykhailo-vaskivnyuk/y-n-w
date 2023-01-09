import Joi from 'joi';
import { IMemberConfirmParams } from '../../../client/common/api/types/types';
import { THandler } from '../../../router/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../utils/member.utils';
import { findUserNet } from '../../utils/net.utils';
import { createTree, updateCountOfMembers } from '../../utils/nodes.utils';

const confirm: THandler<IMemberConfirmParams, boolean> = async (
  { session }, { net_node_id, node_id }
) => {
  const user_id = session.read('user_id')!;
  const [net] = await findUserNet(user_id, net_node_id);
  const { node_id: parent_node_id } = net;
  const [member] = await execQuery.member.findInTree([parent_node_id, node_id]);
  if (!member) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'CONNECTED') return false; // bad request
  await execQuery.member.inviteRemove([node_id]);
  await execQuery.member.inviteConfirm([node_id]);
  await updateCountOfMembers(node_id);
  await createTree(member);
  return true;
};
confirm.paramsSchema = MemberConfirmParamsSchema;
confirm.responseSchema = Joi.boolean();

export = confirm;
