import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const chatCases = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Test CHAT over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    connCount: 3,
    caseUnits: [
      units.account.login.user01,
      [units.account.login.user02, 1],
      [units.account.login.user03, 2],
      units.net.enter.firstNet,
      [units.net.enter.firstNet, 1],
      [units.net.enter.firstNet, 2],
      units.chat.message.sendFirst,
      [units.chat.message.sendSecond, 1],
      [units.chat.message.sendThird, 2],
      [units.chat.message.receiveSecond, 1],
      units.chat.message.receiveFirst,
    ],
  },
];
