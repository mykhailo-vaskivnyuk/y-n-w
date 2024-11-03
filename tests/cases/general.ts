import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const generalCases = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Test API over HTTP',
    dbDataFile: 'restore.sh',
    connection: 'http',
    caseUnits: [
      units.account.login.user(2),
      units.net.create.first,
      units.invite.create.tMember(0),
    ],
  },
  {
    title: 'Test API over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    caseUnits: [
      [units.account.login.user(2), 0],
      [units.account.login.user(3), 1],
      [units.net.create.first, 0],
      [units.invite.create.tMember(0), 0],
      [units.account.login.user(2), 0],
      [units.account.login.user(3), 1],
      [units.net.enter(1), 0],
      [units.vote.set.cMember(3), 0],
      [units.events.check.confirmed, 0],
      [units.net.get.structure(1), 0],
    ],
  },
  {
    title: 'Test API over LINK',
    dbDataFile: 'restore.sh',
    connection: 'link',
    caseUnits: [
      [units.account.login.user(2), 0],
      [units.account.login.user(3), 1],
      [units.net.enter(1), 0],
      [units.vote.set.cMember(3), 0],
      [units.net.create.first, 0],
      [units.invite.create.tMember(0), 0],
      [units.net.create.second, 1],
      [units.invite.create.tMember(0), 1],
    ],
  },
];
