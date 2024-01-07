import test from 'node:test';
import { ITestRunnerData } from './types/types';
import { prepareTest } from './utils/test.utils';
import { assertDb, assertMessage, assertResponse } from './utils/assert.utils';
import { delay } from '../src/utils/utils';
import { TEST_DATA_ARR } from './data/test.data';

const runTest = ({
  title,
  connections,
  onConnMessage,
  testCases,
}: ITestRunnerData) =>
  test(title, async (t) => {
    for (const [data, connIndex] of testCases) {
      const { title, operations } = data;
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
  for (const testData of TEST_DATA_ARR) {
    const { testRunnerData, finalize } = await prepareTest(testData);
    await runTest(testRunnerData);
    await finalize();
    await delay(5000);
  }
};

runAllTests();
