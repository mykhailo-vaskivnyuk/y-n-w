/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type IOperation, type IOperationResponce } from '../../../app/types';

const create = (operation: IOperation['data']): IOperationResponce => {
  // @ts-ignore
  return operation; // execQuery.getUsers();
}

const update = (operation: IOperation['data']): IOperationResponce => {
  // @ts-ignore
  return execQuery.getUsers();
}

export = { create, update };
