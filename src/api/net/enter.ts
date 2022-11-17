import { THandler } from '../../router/types';
import { INetCreateResponse } from '../../client/common/api/types/net.types';
import { NetCreateResponseSchema } from '../schema/net.schema';
import Joi from 'joi';

const enter: THandler<{ net_id: number }, INetCreateResponse> =
  async (context, { net_id }) => {
    const { session } = context;
    const user_id = session.read('user_id');
    const [net] = await execQuery.net.readUserNet([user_id!, net_id]);
    session.write('net_id', net_id);
    session.write('user_state', 'INSIDE_NET');
    return net!;
  };
enter.paramsSchema = {
  net_id: Joi.number().required(),
};
enter.responseSchema = NetCreateResponseSchema;

export = enter;
