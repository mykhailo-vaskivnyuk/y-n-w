import { INetSimpleResponse } from '../../client/common/api/types/net.types';
import { THandler } from '../../router/types';
import { NetSimpleResponseSchema } from '../schema/net.schema';

const getParents: THandler<any, INetSimpleResponse> =
  async ({ session }) => {
    const net_id = session.read('net_id');
    return await execQuery.net.getParents([net_id!]);
  };
getParents.responseSchema = NetSimpleResponseSchema;

export = getParents;
