import Joi from 'joi';
import { THandler } from '../../../router/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { updateCountOfMemebers } from '../../utils/utils';
import { getMemberStatus } from '../../utils/member.utils';

const refuse: THandler<{ node_id: number }, boolean> = async (
  { session }, { node_id }
) => {
  const user_node_id = session.read('node_id')!;
  const [member] = await execQuery.member.find([user_node_id, node_id]);
  if (!member) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'CONNECTED') return false; // bad request
  await execQuery.member.inviteRemove([node_id]);
  const { net_id, ...node } = member;
  const { user_id } = node;
  await execQuery.net.nodes.removeUser([net_id, user_id!]);
  await execQuery.net.user.remove([net_id, user_id!]);
  await updateCountOfMemebers(node!, -1);
  return true;
};
refuse.paramsSchema = MemberConfirmParamsSchema;
refuse.responseSchema = Joi.boolean();

export = refuse;
