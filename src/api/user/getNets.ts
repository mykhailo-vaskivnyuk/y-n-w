import Joi from 'joi';
import { THandler } from '../../router/types';

type IGetNetsResponse = {
  net_id: number;
  name: string;
}

const getNets: THandler<any, IGetNetsResponse[]> =
  async (context) => {
    const { session } = context;
    const user_id = session.read('user_id');
    return execQuery.user.getNets([user_id!]);
  };
getNets.responseSchema = {
  net_id: Joi.number().required(),
  name: Joi.string().required(),
};

export = getNets;
