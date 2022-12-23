import Joi from 'joi';
import { THandler } from '../../../router/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../utils/member.utils';

const confirm: THandler<{ node_id: number }, boolean> = async (
  { session }, { node_id }
) => {
  const user_node_id = session.read('node_id')!;
  const [member] = await execQuery.member.find([user_node_id, node_id]);
  if (!member) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'CONNECTED') return false; // bad request
  await execQuery.member.inviteRemove([node_id]);
  return true;
};
confirm.paramsSchema = MemberConfirmParamsSchema;
confirm.responseSchema = Joi.boolean();

export = confirm;
