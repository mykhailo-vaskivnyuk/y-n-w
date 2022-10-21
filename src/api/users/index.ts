import Joi from 'joi';
import { THandler } from '../../router/types';

const create: THandler<
  { name: string, field: number },
  { name: string }
> = async (context, { name }) => {
  return { name };
};
create.params = {
  name: Joi.string().required(),
  field: Joi.number(),
};
create.schema = Joi.object(create.params);

const update: THandler = () => {
  return execQuery.user.getUsers([]);
}

export = { create, update };
