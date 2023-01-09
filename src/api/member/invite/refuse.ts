import Joi from 'joi';
import { THandler } from '../../../router/types';
import { IMemberConfirmParams } from '../../../client/common/api/types/types';
import { MemberConfirmParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../utils/member.utils';
import { findUserNet, refuseNetUser } from '../../utils/net.utils';

const refuse: THandler<IMemberConfirmParams, boolean> = async (
  { session }, { net_node_id, node_id }
) => {
  const user_id = session.read('user_id')!;
  const [net] = await findUserNet(user_id, net_node_id);
  const { node_id: parent_node_id } = net!;
  const [member] = await execQuery.member.findInTree([parent_node_id, node_id]);
  if (!member) return false; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'CONNECTED') return false; // bad request
  {
    const { user_id } = member;
    await refuseNetUser(user_id!, net_node_id);
  }
  return true;
};
refuse.paramsSchema = MemberConfirmParamsSchema;
refuse.responseSchema = Joi.boolean();

export = refuse;
