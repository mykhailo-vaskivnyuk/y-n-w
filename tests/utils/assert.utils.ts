import assert from 'node:assert';
import { IOperationData, TMockFunction } from '../types/types';
import { delay } from '../../src/client/common/client/connection/utils';
import { TFetch } from '../../src/client/common/client/connection/types';

export const assertDb = async (
  operation: IOperationData,
) => {
  const { query, expectedQueryResult: expected } = operation;
  const actual = await query!();
  assert.deepEqual(actual, expected);
};

export const assertMessage = async (
  operation: IOperationData,
  onMessage: TMockFunction,
) => {
  await delay(1000);
  const [call] = onMessage.mock.calls || [];
  const [actual] = call?.arguments || [undefined];
  const { expected } = operation;
  assert.deepEqual(actual, expected);
};

export const assertResponse = async (
  operation: IOperationData,
  connection: TFetch,
) => {
  const { name, params, setToState, expected } = operation;
  const data = typeof params === 'function' ? params() : params;
  const actual = await connection(name, data);
  setToState?.(actual);
  if (!expected) return;
  if (typeof expected === 'function') expected(actual);
  else assert.deepEqual(actual, expected);
};
