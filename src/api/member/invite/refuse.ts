import Joi from 'joi';
import { THandler } from '../../../router/types';
import { IMemberConfirmParams } from '../../../client/common/api/types/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../../client/common/api/utils';
import { refuseNetUser } from '../../utils/net.utils';

const refuse: THandler<IMemberConfirmParams, boolean> = async (
  { userNet }, { node_id, member_node_id }
) => {
  const [member] = await execQuery.member
    .findInTree([node_id, member_node_id]);
  if (!member) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'CONNECTED') return false; // bad request
  const { net_node_id } = userNet!;
  const { user_id } = member;
  await refuseNetUser(user_id!, net_node_id);
  return true;
};
refuse.paramsSchema = MemberConfirmParamsSchema;
refuse.responseSchema = Joi.boolean();

export = refuse;
