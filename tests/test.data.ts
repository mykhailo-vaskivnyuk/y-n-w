import { createCases } from './utils/create.cases';
import { config } from './config';
import { ITestCasesTree } from './types/test.cases.types';
import { TTestCase } from './types/types';
import { runScript } from './utils/utils';

const VersionsArray = ['restore', 'version2'] as const;
type VersionsKeys = typeof VersionsArray[number];
type TTestData = Record<VersionsKeys, (cases: ITestCasesTree) => TTestCase[]>;

const TEST_DATA: TTestData = {
  restore: (casesTree: ITestCasesTree) => [
    casesTree.account.login.login,
    casesTree.net.create,
  ],
  version2: (casesTree: ITestCasesTree) => [
    casesTree.account.login.login,
    casesTree.net.create,
  ],
};

export const getTestData = async (version: VersionsKeys, state: any) => {
  const script = `sh tests/db/${version}.sh`;
  await runScript(script);
  const cases = await
    createCases(config.casesPath) as unknown as ITestCasesTree;
  return TEST_DATA[version](cases).map((item) => item(state));
};
