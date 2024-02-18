import Joi from 'joi';
import { JOI_NULL } from '../../../controller/constants';
import { THandler } from '../../../controller/types';
import { IMemberInviteParams } from '../../../client/common/server/types/types';
import { MemberInviteParamsSchema } from '../../schema/schema';
import { getMemberStatus } from '../../../client/common/server/utils';
import { exeWithNetLock } from '../../../domain/utils/utils';

const create: THandler<IMemberInviteParams, string | null> = async (
  { member: m }, { node_id, member_node_id, member_name },
) => {
  const { goal, net_id } = await m!.getNet();
  if (!goal) return null; // bad request
  return exeWithNetLock(net_id, async () => {
    await m!.reinit();
    const [member] = await execQuery
      .member.find.inTree([node_id, member_node_id]);
    if (!member) return null; // bad request

    const memberStatus = getMemberStatus(member);
    if (memberStatus !== 'EMPTY') return null; // bad request

    const token = cryptoService.createUnicCode(15);
    await execQuery
      .member.invite.create([node_id, member_node_id, member_name, token]);

    return token;
  });
};
create.paramsSchema = MemberInviteParamsSchema;
create.responseSchema = [Joi.string(), JOI_NULL];
create.checkNet = true;

export = create;
