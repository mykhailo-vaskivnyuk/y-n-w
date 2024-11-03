import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const netCases = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Test LEAVE NET over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    caseUnits: [
      [units.net.get.structure(1), 0],
      [units.account.login.user(1), 1],
      [units.account.login.user(2), 2],
      [units.account.login.user(3), 3],
      [units.net.enter(1), 1],
      [units.net.enter(1), 2],
      [units.net.enter(1), 3],
      [units.net.leave, 2],
      [units.events.newEvents, 1],
      [units.events.newEvents, 3],
      [units.events.read.leave.inTree, 1],
      [units.events.read.leave.inCircle, 3],
      [units.events.check.confirmed, 0],
      [units.net.get.structure(1), 0],
    ],
  },
];
