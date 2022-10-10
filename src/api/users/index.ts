/* eslint-disable @typescript-eslint/ban-ts-comment */
import Joi from 'joi';
import { THandler } from '../../router/types';

const create: THandler<{ name: string }> = async ({ name }) => {
  return { name };
};

create.schema = Joi.object({
  name: Joi.string().required(),
});

const update: THandler = () => {
  return execQuery.getUsers([]);
}

export = { create, update };
