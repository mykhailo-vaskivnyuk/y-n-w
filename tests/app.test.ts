import test from 'node:test';
import { ITestRunnerData } from './types/types';
import { prepareTest } from './utils/test.utils';
import { assertDb, assertMessage, assertResponse } from './utils/assert.utils';
import { delay } from '../src/utils/utils';
import { loadTestData } from './utils/create.cases';

const runTest = ({
  title,
  connections,
  onConnMessage,
  testCases,
}: ITestRunnerData) =>
  test(title, async (t) => {
    const connStates = [];
    for (const [data, connIndex] of testCases) {
      const state: any = connStates[connIndex] || {};
      connStates[connIndex] = state;
      const { title, operations } = data(state);
      const titleWithconnIndex = `${title} [${connIndex}]`;
      await t.test(titleWithconnIndex, async (t) => {
        for (const operation of operations) {
          const { name } = operation;
          await t.test(name, async () => {
            const { query, params } = operation;
            const connection = connections[connIndex]!;
            const onMessage = onConnMessage[connIndex]!;
            if (query) await assertDb(operation);
            else if (!params)
              await assertMessage(operation, onMessage, connIndex);
            else await assertResponse(operation, connection);
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
    await delay(5000);
  }
};

runAllTests();
