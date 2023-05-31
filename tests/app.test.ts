import test from 'node:test';
import assert from 'node:assert';
import { TEST_DATA_ARR } from './data/test.data';
import { ITestRunnerData } from './types/types';
import { prepareTest } from './utils/test.utils';
import { runScript } from './utils/utils';

const runTest = ({
  title,
  connection,
  testCases,
}: ITestRunnerData) =>
  test(title, async (t) => {
    for (const { title, operations } of testCases) {
      await t.test(title, async (t) => {
        for (const operation of operations) {
          const { name, params, response: expected } = operation;
          await t.test(async () => {
            const actual = await connection(name, params);
            assert.deepEqual(actual, expected);
          });
        }
      });
    }
  });

const runAllTests = async () => {
  runScript('rm tests/db/log.txt');
  for (const testData of TEST_DATA_ARR) {
    const { testRunnerData, closeTest } = await prepareTest(testData);
    await runTest(testRunnerData);
    await closeTest();
  }
};

runAllTests();
