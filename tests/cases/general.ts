import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const generalCases = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Test API over HTTP',
    dbDataFile: 'restore.sh',
    connection: 'http',
    caseUnits: [
      units.account.login.user02,
      units.net.create.first,
      units.invite.create.mber0,
    ],
  },
  {
    title: 'Test API over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    connCount: 2,
    caseUnits: [
      [units.account.login.user02, 0],
      [units.account.login.user03, 1],
      units.net.create.first,
      units.invite.create.mber0,
      units.account.login.user02,
      [units.account.login.user03, 1],
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
      units.account.login.user02,
      [units.account.login.user03, 1],
      // units.vote.set.mber1,
      // [units.events.vote, 1],
      units.net.create.first,
      units.invite.create.mber0,
      [units.net.create.second, 1],
      [units.invite.create.mber0, 1],
    ],
  },
];
