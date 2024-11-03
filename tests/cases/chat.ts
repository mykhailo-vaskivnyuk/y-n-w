import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const chatCases = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Test CHAT over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    caseUnits: [
      units.account.login.user(1),
      [units.account.login.user(2), 1],
      [units.account.login.user(3), 2],
      units.net.enter(1),
      [units.net.enter(1), 1],
      [units.net.enter(1), 2],
      units.chat.message.sendFirst,
      [units.chat.message.sendSecond, 1],
      [units.chat.message.sendThird, 2],
      [units.chat.message.receiveSecond, 1],
      units.chat.message.receiveFirst,
    ],
  },
];
