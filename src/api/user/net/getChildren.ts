import Joi from 'joi';
import { INetSimpleResponse } from '../../../client/common/api/types/net.types';
import { JOI_NULL } from '../../../router/constants';
import { THandler } from '../../../router/types';
import { NetSimpleResponseSchema } from '../../schema/net.schema';

const getChildren: THandler<{ net_id: number | null }, INetSimpleResponse[]> =
  async ({ session }) => {
    const user_id = session.read('user_id');
    const net_id = session.read('net_id') || null;
    return await execQuery.user.net.getChildren([user_id!, net_id]);
  };
getChildren.paramsSchema = {
  net_id: [JOI_NULL, Joi.number().required()],
};
getChildren.responseSchema = NetSimpleResponseSchema;

export = getChildren;
