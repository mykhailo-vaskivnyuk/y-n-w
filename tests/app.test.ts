import { ITestUnits } from './types/types';
import { ITestUnitsMap } from './types/test.units.types';
import { config } from './config';
import * as casesMap from './cases';
import { DirLoader } from '../lib/dir.loader';
import { createUnitsTypes } from './utils/create.units.types';
import { prepareTest } from './utils/test.utils';
import { runTest } from './utils/test.runner';

const getCasesAll = () => Object.values(casesMap).map(Object.values).flat();

const getUnitsMap = async () => {
  const { unitsPath } = config;
  const loader = new DirLoader<ITestUnits>(unitsPath);
  const units = await loader.load();
  await createUnitsTypes(config, units);
  return units;
};

export const runTests = async () => {
  const casesAll = getCasesAll();
  const unitsMap = await getUnitsMap();
  for (const getCasesGroup of casesAll) {
    const casesGroup = getCasesGroup(unitsMap as unknown as ITestUnitsMap);
    for (const testCase of casesGroup) {
      const test = await prepareTest(testCase);
      await runTest(test.testRunnerData);
      await test.finalize();
    }
  }
};

runTests();
