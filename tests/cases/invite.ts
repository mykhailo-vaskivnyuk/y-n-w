import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const invite = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Test INVITE IN NET 1 over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    caseUnits: [
      [units.account.login.user(1), 1],
      [units.net.enter(1), 1],
      [units.invite.create.tMember(0), 1],
      //
      [units.account.login.user(4), 4],
      [units.net.connectByToken.withErrorToNet(1), 4],
      //
      [units.account.login.user(2), 2],
      [units.account.login.user(3), 3],
      //
      [units.account.signup.user(5), 4],
      [units.net.connectByToken.toNet(1), 4],
      // events
      [units.events.newEvents, 1],
      [units.events.newEvents, 2],
      [units.events.newEvents, 3],
      [units.events.read.connectAndConfirmInTree, 1],
      [units.events.read.connectAndConfirmInCircle, 2],
      [units.events.read.connectAndConfirmInCircle, 3],
      //
      [units.events.check.confirmed, 1],
      [units.net.get.structure(1), 0],
    ],
  },
];
