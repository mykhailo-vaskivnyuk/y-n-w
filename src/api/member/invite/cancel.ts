import Joi from 'joi';
import { IMemberConfirmParams } from '../../../client/common/api/types/types';
import { THandler } from '../../../router/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../utils/member.utils';

const cancel: THandler<IMemberConfirmParams, boolean> = async (
  _, { node_id, member_node_id }
) => {
  const [member] = await execQuery.member
    .findInTree([node_id, member_node_id]);
  if (!member) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'INVITED') return false; // bad request
  await execQuery.member.invite.remove([member_node_id]);
  return true;
};
cancel.paramsSchema = MemberConfirmParamsSchema;
cancel.responseSchema = Joi.boolean();

export = cancel;
