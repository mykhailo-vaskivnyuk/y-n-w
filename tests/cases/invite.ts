import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const invite = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Test INVITE IN NET 1 over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    connCount: 3,
    caseUnits: [
      [units.account.login.user(1), 1],
      [units.net.enter(1), 1],
      [units.invite.create.tMember(0), 1],
      //
      [units.account.login.user(4), 2],
      [units.net.connectByToken.withErrorToNet(1), 2],
      //
      [units.account.signup.user(5), 2],
      [units.net.connectByToken.toNet(1), 2],
      [units.events.newEvents, 1],
      [units.events.read.connect, 1],
      //
      [units.events.check.confirmed, 1],
      [units.net.get.structure(1), 0],
    ],
  },
];
