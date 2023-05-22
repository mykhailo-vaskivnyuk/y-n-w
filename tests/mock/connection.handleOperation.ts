import {
  IOperation, TOperationResponse,
} from '../../src/types/operation.types';

type TExecOperation = (operation: IOperation) => Promise<TOperationResponse>;

let callback: TExecOperation = async () => ({});

export const setCallback = (cb: TExecOperation) => {
  console.log('TEST');
  callback = cb;
};

export const handleOperation = (operation: IOperation) => callback(operation);
