/* eslint-disable @typescript-eslint/ban-ts-comment */
import { THandler } from '../../router/types';

const create: THandler<{ name: string }> = async ({ name }) => {
  return { name };
};

create.schema = {
  name: '199',
};

const update: THandler = async () => {
  return execQuery.getUsers([]);
}

export = { create, update };
