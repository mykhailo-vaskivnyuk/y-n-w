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
create.responseSchema = {
  name: Joi.string(),
};

const update: THandler = async () => {
  return '';
}
update.responseSchema = Joi.string();

export = { create, update };
