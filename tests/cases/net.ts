import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const netCases = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Test LEAVE NET over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    connCount: 3,
    caseUnits: [
      [units.account.login.user01, 0],
      [units.account.login.user02, 1],
      [units.account.login.user03, 2],
      [units.net.enter.main, 0],
      [units.net.enter.main, 1],
      [units.net.enter.main, 2],
      [units.net.leave, 1],
      [units.events.newEvents, 0],
      [units.events.newEvents, 2],
      [units.events.read.leaveInTree, 0],
      [units.events.read.leaveInCircle, 2],
    ],
  },
];
