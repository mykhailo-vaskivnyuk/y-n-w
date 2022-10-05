/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type IOperation, type IOperationResponce } from '../../app/types';

const create = (operation: IOperation['data']): IOperationResponce => {
  // @ts-ignore
  return Queries.getUsers();
}

const update = (operation: IOperation['data']): IOperationResponce => {
  // @ts-ignore
  return Queries.getUsers();
}

export = { create, update };
