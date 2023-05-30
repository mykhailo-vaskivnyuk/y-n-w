import { createCases } from './utils/create.cases';
import { config } from './config';
import { ITestCasesTree } from './types/test.cases.types';
import { TTestCase } from './types/types';
import { runScript } from './utils/utils';
import { TTransport } from '../src/server/types';

export interface ITestData {
  name: string;
  dbData: string;
  connection: TTransport;
  cases: (cases: ITestCasesTree) => TTestCase[]
}

export const getTestData = async (testData: ITestData, state: any) => {
  const script = `sh tests/db/${testData.dbData}.sh`;
  await runScript(script);
  const casesTree = await
    createCases(config.casesPath) as unknown as ITestCasesTree;
  return testData.cases(casesTree).map((item) => item(state));
};

export const TEST_DATA_ARR: ITestData[] = [
  {
    name: 'Test API over HTTP',
    dbData: 'restore',
    connection: 'ws',
    cases: (casesTree: ITestCasesTree) => [
      casesTree.account.login.login,
      casesTree.net.create,
    ],
  },
  {
    name: 'Test API over WS',
    dbData: 'restore',
    connection: 'ws',
    cases: (casesTree: ITestCasesTree) => [
      casesTree.account.login.login,
      casesTree.net.create,
    ],
  },
];
