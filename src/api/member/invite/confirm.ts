import Joi from 'joi';
import {
  IMemberConfirmParams,
} from '../../../client/common/server/types/types';
import { THandler } from '../../../router/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../../client/common/server/utils';
import { createTree, updateCountOfMembers } from '../../utils/nodes.utils';

const confirm: THandler<IMemberConfirmParams, boolean> = async (
  _, { node_id, member_node_id }
) => {
  const [member] = await execQuery.member
    .find.inTree([node_id, member_node_id]);
  if (!member) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'CONNECTED') return false; // bad request
  await execQuery.member.invite.remove([member_node_id]);
  await execQuery.member.confirm([member_node_id]);
  await updateCountOfMembers(member_node_id);
  await createTree(member);
  return true;
};
confirm.paramsSchema = MemberConfirmParamsSchema;
confirm.responseSchema = Joi.boolean();

export = confirm;
