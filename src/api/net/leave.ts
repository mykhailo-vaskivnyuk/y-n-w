import Joi from 'joi';
import { INetReadParams } from '../../client/common/api/types/types';
import { THandler } from '../../router/types';
import { NetReadParamsSchema } from '../schema/schema';
import { arrangeNodes, findUserNet, removeNetUser } from '../utils/net.utils';

const leave: THandler<INetReadParams> = async (
  { session }, { net_node_id },
) => {
  const user_id = session.read('user_id')!;
  await findUserNet(user_id, net_node_id);
  const nodesToArrange = await removeNetUser(user_id, net_node_id);
  await arrangeNodes(nodesToArrange);
  return true;
};
leave.paramsSchema = NetReadParamsSchema;
leave.responseSchema = Joi.boolean();

export = leave;
