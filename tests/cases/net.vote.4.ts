/* eslint-disable max-lines */
import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const netVote = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Test VOTES FOR ROOT IN NET 1 over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    caseUnits: [
      [units.account.login.user(1), 0],
      [units.account.login.user(2), 1],
      [units.account.login.user(3), 2],
      [units.account.login.user(4), 3],
      //
      [units.net.enter(1), 1],
      [units.vote.set.cMember(3), 1],
      [units.net.enter(1), 2],
      [units.vote.setFinal.self, 2],
      [units.events.read.vote.forVoteMember, 2],
      [units.events.read.vote.forDisvoteMember, 0],
      [units.events.read.vote.forMembers, 1],
      [units.events.newEvents, 3],
      [units.events.read.vote.forConnectedInCircle, 3],
      //
      [units.vote.set.cMember(3), 1],
      [units.net.enter(1), 0],
      [units.vote.setFinal.self, 0],
      [units.events.read.vote.forVoteMember, 0],
      [units.events.read.vote.forDisvoteMember, 2],
      [units.events.read.vote.forMembers, 1],
      //
      [units.events.check.confirmed, 0],
      [units.net.get.structure(1), 0],
    ],
  },
];
