import { ITestData } from '../types/types';

export const TEST_DATA_ARR: ITestData[] = [
  {
    title: 'Test API over HTTP',
    dbDataFile: 'restore.sh',
    connection: 'http',
    cases: [
      testCases.account.login.user02,
      testCases.net.create.first,
      testCases.invite.create,
    ],
  },
  {
    title: 'Test LEAVE NET over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    connCount: 3,
    cases: [
      testCases.account.login.user01,
      [testCases.account.login.user02, 1],
      [testCases.account.login.user03, 2],
      testCases.net.enter.firstNet,
      [testCases.net.enter.firstNet, 1],
      [testCases.net.enter.firstNet, 2],
      [testCases.net.leave.parent, 1],
      // testCases.events.newEvents,
      // [testCases.events.newEvents, 2],
    ],
  },
  {
    title: 'Test CHAT over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    connCount: 3,
    cases: [
      testCases.account.login.user01,
      [testCases.account.login.user02, 1],
      [testCases.account.login.user03, 2],
      testCases.net.enter.firstNet,
      [testCases.net.enter.firstNet, 1],
      [testCases.net.enter.firstNet, 2],
      testCases.chat.message.sendFirst,
      [testCases.chat.message.sendSecond, 1],
      [testCases.chat.message.sendThird, 2],
      [testCases.chat.message.receiveSecond, 1],
      testCases.chat.message.receiveFirst,
    ],
  },
  {
    title: 'Test API over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    connCount: 2,
    cases: [
      testCases.account.login.user02,
      [testCases.account.login.user03, 1],
      testCases.net.create.first,
      testCases.invite.create,
      testCases.account.login.user02,
      [testCases.account.login.user03, 1],
      testCases.vote.set,
      // [testCases.events.vote, 1],
    ],
  },
  {
    title: 'Test API over LINK',
    dbDataFile: 'restore.sh',
    connection: 'link',
    connCount: 2,
    cases: [
      testCases.account.login.user02,
      [testCases.account.login.user03, 1],
      testCases.vote.set,
      // [testCases.events.vote, 1],
      testCases.net.create.first,
      testCases.invite.create,
      [testCases.net.create.second, 1],
      [testCases.invite.create, 1],
    ],
  },
];
