import Joi from 'joi';
import { THandler } from '../../router/types';
import { ITokenParams } from '../../client/common/api/types/types';
import { JOI_NULL } from '../../router/constants';
import { TokenParamsSchema } from '../schema/schema';

type INetConnectByToken = {
  net_node_id: number;
  error?: 'already connected' | 'not parent net member';
} | null

const connectByToken: THandler<ITokenParams, INetConnectByToken> =
  async ({ session }, { token }) => {
    const user_id = session.read('user_id')!;
    const [net] = await execQuery.net.find.byToken([token, user_id]);
    if (!net) return null;

    const { parent_net_id, user_exists, ...node } = net;
    const { net_node_id, node_id } = node;

    if (user_exists) return { net_node_id, error: 'already connected' };

    if (parent_net_id) {
      const [parentNet] = await execQuery.user.net
        .find([user_id, parent_net_id]);
      if (!parentNet) return { net_node_id, error: 'not parent net member' };
    }

    /* remove token */
    await execQuery.member.inviteRemove([node_id]);
    /* connect user to node + create net user data */
    await execQuery.net.user.connect([node_id, user_id]);

    return { net_node_id };
  };
connectByToken.paramsSchema = TokenParamsSchema;
connectByToken.responseSchema = [JOI_NULL, {
  net_node_id: Joi.number().required(),
  error: Joi.string(),
}];

export = connectByToken;
