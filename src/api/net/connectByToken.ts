import Joi from 'joi';
import { THandler } from '../../router/types';
import { ITokenParams } from '../../client/common/api/types/types';
import { JOI_NULL } from '../../router/constants';
import { createTree, updateCountOfMemebers } from '../utils/utils';
import { TokenParamsSchema } from '../schema/schema';

type INetConnectByToken = {
  net_id: number;
  error?: 'already connected';
}

const connectByToken: THandler<ITokenParams, INetConnectByToken | null> =
  async ({ session }, { token }) => {
    const user_id = session.read('user_id')!;
    const [result] = await execQuery.net.find.byToken([token, user_id]);
    if (!result) return null;

    const { net_id, user_id: user_id_exists, ...node } = result;
    if (user_id_exists) return { net_id, error: 'already connected' };

    const { node_id } = node;

    /* connect user to node */
    await execQuery.node.user.connect([node_id, user_id]);
    await updateCountOfMemebers(node);

    /* create node tree */
    await createTree(node);

    /* create net user data */
    await execQuery.net.user.createData([net_id, user_id]);

    return { net_id };
  };
connectByToken.paramsSchema = TokenParamsSchema;
connectByToken.responseSchema = [JOI_NULL, {
  net_id: Joi.number().required(),
  error: Joi.string(),
}];

export = connectByToken;
