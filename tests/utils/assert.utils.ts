import assert from 'node:assert';
import { IOperationData, TMockFunction } from '../types/types';
import { delay } from '../../src/client/common/client/connection/utils';
import { TFetch } from '../../src/client/common/client/connection/types';

export const assertDb = async (operation: IOperationData) => {
  const { query, expectedQueryResult: expected } = operation;
  const actual = await query!();
  if (typeof expected === 'function') expected(actual);
  else assert.deepEqual(actual, expected);
};

export const assertMessage = async (
  operation: IOperationData,
  onMessage: TMockFunction,
  callId: number,
) => {
  await delay(75);
  const call = onMessage!.mock.calls[callId];
  const actual = call?.arguments[0];
  const { expected } = operation;
  if (typeof expected === 'function') expected(actual);
  else assert.deepEqual(actual, expected);
};

export const assertResponse = async (
  operation: IOperationData,
  connection: TFetch,
) => {
  const { name, params, setToState, expected } = operation;
  const data = typeof params === 'function' ? params() : params;
  const actual = await connection(name, data);
  setToState?.(actual);
  if (expected === undefined) return;
  if (typeof expected === 'function') expected(actual);
  else assert.deepEqual(actual, expected);
};
