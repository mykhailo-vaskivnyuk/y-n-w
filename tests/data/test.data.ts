import { ITestCasesTree } from '../types/test.cases.types';
import { ITestData } from '../types/types';

export const TEST_DATA_ARR: ITestData[] = [
  // {
  //   title: 'Test API over HTTP',
  //   dbData: 'restore',
  //   connection: 'http',
  //   cases: (casesTree: ITestCasesTree) => [
  //     casesTree.account.login.login,
  //     casesTree.net.create,
  //   ],
  // },
  // {
  //   title: 'Test API over WS',
  //   dbData: 'restore',
  //   connection: 'ws',
  //   cases: (casesTree: ITestCasesTree) => [
  //     casesTree.account.login.login,
  //     casesTree.net.create,
  //   ],
  // },
  {
    title: 'Test API over LINK',
    dbData: 'restore',
    connection: 'link',
    cases: (casesTree: ITestCasesTree) => [
      casesTree.account.login.login,
      casesTree.net.create,
      casesTree.invite.create,
    ],
  },
];
