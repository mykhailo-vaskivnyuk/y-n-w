import Joi from 'joi';
import { ITableNets } from '../../db/db.types';
import { THandler } from '../../router/types';

type INetCreateParams  = Omit<ITableNets, 'net_id'>;

const create: THandler<INetCreateParams, ITableNets> =
  async (context, params) => {
    const {
      net_level, parent_net_id, first_net_id, count_of_nets,
    } = params;
    const [net] = await execQuery.net.create(
      [net_level, parent_net_id, first_net_id, count_of_nets],
    );
    return net!;
  };
create.paramsSchema = {
  net_level: Joi.number().integer(),
  parent_net_id: [Joi.number().integer(), Joi.any().equal(null)],
  first_net_id: [Joi.number().integer(), Joi.any().equal(null)],
  count_of_nets: Joi.number().integer(),
};
create.responseSchema =   {
  net_id: Joi.number().integer(),
  net_level: Joi.number().integer(),
  parent_net_id: [Joi.number().integer(), Joi.any().equal(null)],
  first_net_id: [Joi.number().integer(), Joi.any().equal(null)],
  count_of_nets: Joi.number().integer(),
};

export = create;
