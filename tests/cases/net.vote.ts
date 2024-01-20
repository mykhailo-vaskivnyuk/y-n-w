/* eslint-disable max-lines */
import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const netVote = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Test VOTES IN NET over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    connCount: 7,
    caseUnits: [ //                           01 02
      [units.account.login.user01, 0], //     x   0
      [units.account.login.user02, 1], //     1   x
      [units.account.login.user03, 2], //     3   3
      [units.account.login.user04, 3], //     5   5
      [units.account.signup.user05, 4], //    0   1
      [units.account.signup.user06, 5], //    2   2
      [units.account.signup.user07, 6], //    4   4
      [units.net.enter.main, 0],
      [units.invite.confirm.mber5, 0],
      [units.invite.create.mber0, 0],
      [units.net.connetByToken, 4],
      [units.invite.confirm.mber0, 0],
      [units.invite.create.mber2, 0],
      [units.net.connetByToken, 5],
      [units.invite.confirm.mber2, 0],
      [units.invite.create.mber4, 0],
      [units.net.connetByToken, 6],
      [units.invite.confirm.mber4, 0],
      [units.net.enter.main, 1],
      [units.net.enter.main, 2],
      [units.net.enter.main, 3],
      [units.net.enter.main, 4],
      [units.net.enter.main, 5],
      [units.net.enter.main, 6],
      [units.vote.set.mber1, 1],
      [units.events.vote.set, 2],
      [units.events.vote.set, 3],
      [units.events.vote.set, 4],
      [units.events.vote.set, 5],
      [units.events.vote.set, 6],
      [units.vote.set.mber2, 1],
      [units.events.vote.set, 2],
      [units.events.vote.set, 3],
      [units.events.vote.set, 4],
      [units.events.vote.set, 5],
      [units.events.vote.set, 6],
      [units.vote.set.mber3, 1],
      [units.events.vote.set, 2],
      [units.events.vote.set, 3],
      [units.events.vote.set, 4],
      [units.events.vote.set, 5],
      [units.events.vote.set, 6],
      [units.vote.set.mber4, 1],
      [units.events.vote.set, 2],
      [units.events.vote.set, 3],
      [units.events.vote.set, 4],
      [units.events.vote.set, 5],
      [units.events.vote.set, 6],
      [units.vote.set.mber5, 1],
      [units.events.vote.set, 2],
      [units.events.vote.set, 3],
      [units.events.vote.set, 4],
      [units.events.vote.set, 5],
      [units.events.vote.set, 6],
      [units.vote.set.mber2, 2],
      [units.events.vote.set, 1],
      [units.events.vote.set, 3],
      [units.events.vote.set, 4],
      [units.events.vote.set, 5],
      [units.events.vote.set, 6],
      [units.vote.set.mber2, 3],
      [units.events.vote.set, 1],
      [units.events.vote.set, 2],
      [units.events.vote.set, 4],
      [units.events.vote.set, 5],
      [units.events.vote.set, 6],
      [units.vote.set.mber1, 4],
      [units.events.vote.set, 1],
      [units.events.vote.set, 2],
      [units.events.vote.set, 3],
      [units.events.vote.set, 5],
      [units.events.vote.set, 6],
      [units.vote.set.mber2, 5],
      [units.events.vote.set, 1],
      [units.events.vote.set, 2],
      [units.events.vote.set, 3],
      [units.events.vote.set, 4],
      [units.events.vote.set, 6],
      [units.vote.set.mber2, 6],
      [units.events.vote.set, 1],
      [units.events.vote.set, 2],
      [units.events.vote.set, 3],
      [units.events.vote.set, 4],
      [units.events.vote.set, 5],
      [units.vote.set.self, 1],
      [units.vote.check.self, 1],
      [units.events.newEvents, 2],
      [units.events.newEvents, 3],
      [units.events.newEvents, 4],
      [units.events.newEvents, 5],
      [units.events.newEvents, 6],
      [units.events.read.voteForDisvoteMember, 0],
      [units.events.read.voteForVoteMember, 1],
      [units.events.read.voteForMembers, 2],
      [units.events.read.voteForMembers, 3],
      [units.events.read.voteForMembers, 4],
      [units.events.read.voteForMembers, 5],
      [units.events.read.voteForMembers, 6],
    ],
  },
];
