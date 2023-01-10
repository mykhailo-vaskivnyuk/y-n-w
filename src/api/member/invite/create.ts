import Joi from 'joi';
import { JOI_NULL } from '../../../router/constants';
import { THandler } from '../../../router/types';
import { IMemberInviteParams } from '../../../client/common/api/types/types';
import { MemberInviteParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../utils/member.utils';
import { createUnicCode } from '../../../utils/crypto';

const create: THandler<IMemberInviteParams, string | null> = async (
  _, { node_id, member_node_id, member_name },
) => {
  const [member] = await execQuery.member
    .findInTree([node_id, member_node_id]);
  if (!member) return null; // bad request
  const memberStatus = getMemberStatus(member);
  if (memberStatus !== 'EMPTY') return null; // bad request
  const token = createUnicCode(15);
  await execQuery.member.invite
    .create([node_id, member_node_id, member_name, token]);
  return token;
};
create.paramsSchema = MemberInviteParamsSchema;
create.responseSchema = [Joi.string(), JOI_NULL];

export = create;
