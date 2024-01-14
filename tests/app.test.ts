import test from 'node:test';
import { ITestRunnerData } from './types/types';
import { ITestUnitsMap } from './types/test.units.types';
import { getCasesAll, getUnitsMap } from './utils/load.units';
import { prepareTest } from './utils/test.utils';
import { assertDb, assertMessage, assertResponse } from './utils/assert.utils';

const runTest = ({
  title,
  connections,
  onMessage,
  testUnits,
}: ITestRunnerData) =>
  test(title, async (t) => {
    const global: Record<string, any> = {};
    const states: Record<string, any>[] = [];
    const calls: number[] = [];
    for (const [getUnit, connId] of testUnits) {
      const state = states[connId] || { global };
      states[connId] = state;
      const { title, operations } = getUnit(state);
      const connAndTitle = `${connId} - ${title}`;
      await t.test(connAndTitle, async (t) => {
        for (const operation of operations) {
          const { name } = operation;
          await t.test(name, async () => {
            const { query, params } = operation;
            const connection = connections[connId]!;
            if (query) await assertDb(operation);
            else if (!params) {
              const callId = calls[connId] || 0;
              await assertMessage(operation, onMessage[connId]!, callId);
              calls[connId] = callId + 1;
            } else await assertResponse(operation, connection);
          });
        }
      });
    }
  });

const runTests = async () => {
  const cases = getCasesAll();
  const unitsMap = await getUnitsMap() as unknown as ITestUnitsMap;
  for (const getCaseGroup of cases) {
    const caseGroup = getCaseGroup(unitsMap);
    for (const testCase of caseGroup) {
      const { testRunnerData, finalize } = await prepareTest(testCase);
      await runTest(testRunnerData);
      await finalize();
    }
  }
};

runTests();
