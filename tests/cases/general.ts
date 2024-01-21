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
    connCount: 2,
    caseUnits: [
      [units.account.login.user(2), 0],
      [units.account.login.user(3), 1],
      units.net.create.first,
      units.invite.create.tMember(0),
      units.account.login.user(2),
      [units.account.login.user(3), 1],
      // units.vote.set.mber1,
      // [units.events.vote, 1],
    ],
  },
  {
    title: 'Test API over LINK',
    dbDataFile: 'restore.sh',
    connection: 'link',
    connCount: 2,
    caseUnits: [
      units.account.login.user(2),
      [units.account.login.user(3), 1],
      // units.vote.set.mber1,
      // [units.events.vote, 1],
      units.net.create.first,
      units.invite.create.tMember(0),
      [units.net.create.second, 1],
      [units.invite.create.tMember(0), 1],
    ],
  },
];
