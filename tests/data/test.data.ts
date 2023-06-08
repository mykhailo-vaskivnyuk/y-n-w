import { ITestCasesTree } from '../types/test.cases.types';
import { ITestData } from '../types/types';

export const TEST_DATA_ARR: ITestData[] = [
  {
    title: 'Test API over HTTP',
    dbDataFile: 'restore.sh',
    connection: 'http',
    cases: (casesTree: ITestCasesTree) => [
      casesTree.account.login.user02,
      casesTree.net.create.first,
      casesTree.invite.create,
    ],
  },
  {
    title: 'Test API over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    connCount: 2,
    cases: (casesTree: ITestCasesTree) => [
      casesTree.account.login.user02,
      [casesTree.account.login.user03, 1],
      casesTree.net.create.first,
      casesTree.invite.create,
      casesTree.account.login.user02,
      [casesTree.account.login.user03, 1],
      casesTree.vote.set,
      [casesTree.events.vote, 1],
    ],
  },
  {
    title: 'Test API over LINK',
    dbDataFile: 'restore.sh',
    connection: 'link',
    connCount: 2,
    cases: (casesTree: ITestCasesTree) => [
      casesTree.account.login.user02,
      [casesTree.account.login.user03, 1],
      casesTree.vote.set,
      [casesTree.events.vote, 1],
      casesTree.net.create.first,
      casesTree.invite.create,
      [casesTree.net.create.second, 1],
      [casesTree.invite.create, 1],
    ],
  },
];
