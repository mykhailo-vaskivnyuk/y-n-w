import Joi from 'joi';
import { THandler } from '../../router/types';

const create: THandler<
  { name: string, field: number },
  { name: string }
> = async (context, { name }) => ({ name });
create.paramsSchema = {
  name: Joi.string().required(),
  field: Joi.number(),
};
create.responseSchema = {
  name: Joi.string(),
};

const update: THandler = async () => '';
update.responseSchema = Joi.string();

export = { create, update };
