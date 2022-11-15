import { ITableNets } from '../../db/db.types';
import { THandler } from '../../router/types';
import { NetCreateResponse, NetCreateParamsSchema } from '../schema/net.schema';

type INetCreateParams  = Partial<Omit<ITableNets, 'net_id'>>;

const create: THandler<INetCreateParams, ITableNets> =
  async (context, params) => {
    const {
      net_level = 0,
      parent_net_id = null,
      first_net_id = null,
      count_of_nets = 0,
    } = params;
    const [net] = await execQuery.net.create(
      [net_level, parent_net_id, first_net_id, count_of_nets],
    );
    return net!;
  };
create.paramsSchema = NetCreateParamsSchema;
create.responseSchema = NetCreateResponse;

export = create;
