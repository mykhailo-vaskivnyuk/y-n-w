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

const callIndex: number[] = [];
export const assertMessage = async (
  operation: IOperationData,
  onMessage: TMockFunction[],
  connId: number,
) => {
  await delay(200);
  const index = callIndex[connId] || 0;
  const call = onMessage[connId]!.mock.calls[index];
  if (call) callIndex[connId] = index + 1;
  const [actual] = call?.arguments || [];
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
  if (!expected) return;
  if (typeof expected === 'function') expected(actual);
  else assert.deepEqual(actual, expected);
};
