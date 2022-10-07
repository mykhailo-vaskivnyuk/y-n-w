import { type IOperation, type IOperationResponce } from '../../../app/types';

const merega = (operation: IOperation['data']): IOperationResponce => {
  return { ...operation, from: 'merega' };
}

export = merega;
