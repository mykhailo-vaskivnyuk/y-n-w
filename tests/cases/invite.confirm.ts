import config from '../../src/config';
import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const inviteConfirm = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Test INVITE IN NET 1 over WS with CONFIRM',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    config: { env: { ...config.env, INVITE_CONFIRM: true } },
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
      // connect
      [units.account.signup.user(5), 4],
      [units.net.connectByToken.toNet(1), 4],
      // events
      [units.events.newEvents, 1],
      [units.events.read.connect, 1],
      // confirm
      [units.invite.confirm.tMember(0), 1],
      // events
      [units.events.newEvents, 2],
      [units.events.newEvents, 3],
      [units.events.newEvents, 4],
      [units.events.read.confirmInCircle, 2],
      [units.events.read.confirmInCircle, 3],
      [units.events.read.confirm, 4],
      //
      [units.events.check.confirmed, 1],
      [units.net.get.structure(1), 0],
    ],
  },
];
