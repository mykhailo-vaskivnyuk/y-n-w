import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const netCases = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Test LEAVE NET over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    caseUnits: [
      [units.account.login.user(1), 1],
      [units.account.login.user(2), 2],
      [units.account.login.user(3), 3],
      [units.account.login.user(4), 4],
      [units.net.enter(1), 1],
      [units.net.enter(1), 2],
      [units.net.enter(1), 3],
      [units.net.leave, 1],
      [units.events.newEvents, 2],
      [units.events.newEvents, 3],
      [units.events.read.leave.leaveFacilitator, 2],
      [units.events.read.leave.leaveFacilitator, 3],
      [units.events.read.disconnect.leaveFacilitator, 4],
      [units.net.leave, 2],
      [units.net.get.structure(5), 0],
      [units.events.check.confirmed, 0],
    ],
  },
];
