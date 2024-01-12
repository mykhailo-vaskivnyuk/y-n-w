import test from 'node:test';
import { ITestRunnerData } from './types/types';
import { prepareTest } from './utils/test.utils';
import { assertDb, assertMessage, assertResponse } from './utils/assert.utils';
import { loadTestData } from './utils/create.cases';

const runTest = ({
  title,
  connections,
  onMessage,
  testCases,
}: ITestRunnerData) =>
  test(title, async (t) => {
    const states: any[] = [];
    const callIds: number[] = [];
    for (const [getCase, connId] of testCases) {
      const state = states[connId] || {};
      states[connId] = state;
      const { title, operations } = getCase(state);
      const titleAndConn = `${title} [${connId}]`;
      await t.test(titleAndConn, async (t) => {
        for (const operation of operations) {
          const { name } = operation;
          await t.test(name, async () => {
            const { query, params } = operation;
            const connection = connections[connId]!;
            if (query) await assertDb(operation);
            else if (!params) {
              const callId = callIds[connId] || 0;
              await assertMessage(operation, onMessage[connId]!, callId);
              callIds[connId] = callId + 1;
            } else await assertResponse(operation, connection);
          });
        }
      });
    }
  });

const runAllTests = async () => {
  const testDataArr = await loadTestData();
  for (const testData of testDataArr) {
    const { testRunnerData, finalize } = await prepareTest(testData);
    await runTest(testRunnerData);
    await finalize();
  }
};

runAllTests();
