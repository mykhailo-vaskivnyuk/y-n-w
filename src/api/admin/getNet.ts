import { THandler } from '../../controller/types';
import { INetEnterParams } from '../../client/common/server/types/types';
import { NetEnterParamsSchema } from '../schema/schema';

const getNet: THandler<INetEnterParams, any> = async (_, { net_id }) => {
  const [rootMember] = await execQuery.net.structure.get.root([net_id]);

  if (!rootMember) return { net: 'null' };

  const net = await domain.net.getNetNode(rootMember);
  domain.net.showNet(net);

  return { net };
};
getNet.paramsSchema = NetEnterParamsSchema;
getNet.responseSchema = {};
getNet.allowedForUser = 'NOT_LOGGEDIN';

export = getNet;
