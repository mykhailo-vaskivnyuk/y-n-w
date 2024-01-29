/* eslint-disable max-lines */
import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const netVote = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Test VOTES IN NET 2 over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    connCount: 9,
    caseUnits: [
      [units.net.get.structure(2), 0],
      // singup users 5...14
      [units.account.signup.user(5), 1],
      [units.user.update.password, 1],
      [units.account.signup.user(6), 1],
      [units.user.update.password, 1],
      [units.account.signup.user(7), 1],
      [units.user.update.password, 1],
      [units.account.signup.user(8), 1],
      [units.user.update.password, 1],
      [units.account.signup.user(9), 1],
      [units.user.update.password, 1],
      [units.account.signup.user(10), 1],
      [units.user.update.password, 1],
      [units.account.signup.user(11), 1],
      [units.user.update.password, 1],
      [units.account.signup.user(12), 1],
      [units.user.update.password, 1],
      [units.account.signup.user(13), 1],
      [units.user.update.password, 1],
      [units.account.signup.user(14), 1],
      [units.user.update.password, 1],
      // user 5 create net 2
      [units.account.login.user(5), 1],
      [units.net.create.root2, 1],
      [units.net.get.structure(2), 0],
      // user 5 connect user 6
      [units.invite.create.tMember(0), 1],
      [units.account.login.user(6), 2],
      [units.net.connectByToken.toNet(2), 2],
      [units.invite.confirm.tMember(0), 1],
      // user 5 connect user 7
      [units.invite.create.tMember(1), 1],
      [units.account.login.user(7), 2],
      [units.net.connectByToken.toNet(2), 2],
      [units.invite.confirm.tMember(1), 1],
      // user 7 connect user 8
      [units.net.enter(2), 2],
      [units.invite.create.tMember(0), 2],
      [units.account.login.user(8), 1],
      [units.net.connectByToken.toNet(2), 1],
      [units.invite.confirm.tMember(0), 2],
      // user 7 connect user 9
      [units.invite.create.tMember(1), 2],
      [units.account.login.user(9), 1],
      [units.net.connectByToken.toNet(2), 1],
      [units.invite.confirm.tMember(1), 2],
      // user 7 connect user 10
      [units.invite.create.tMember(2), 2],
      [units.account.login.user(10), 1],
      [units.net.connectByToken.toNet(2), 1],
      [units.invite.confirm.tMember(2), 2],
      // user 7 connect user 11
      [units.invite.create.tMember(3), 2],
      [units.account.login.user(11), 1],
      [units.net.connectByToken.toNet(2), 1],
      [units.invite.confirm.tMember(3), 2],
      // user 7 connect user 12
      [units.invite.create.tMember(4), 2],
      [units.account.login.user(12), 1],
      [units.net.connectByToken.toNet(2), 1],
      // user 7 invite create
      [units.invite.create.tMember(5), 2],
      // user 8 connect user 13
      [units.account.login.user(8), 1],
      [units.net.enter(2), 1],
      [units.invite.create.tMember(0), 1],
      [units.account.login.user(13), 2],
      [units.net.connectByToken.toNet(2), 2],
      [units.invite.confirm.tMember(0), 1],
      // user 8 connect user 14
      [units.invite.create.tMember(1), 1],
      [units.account.login.user(14), 2],
      [units.net.connectByToken.toNet(2), 2],
      // user 8 invite create
      [units.invite.create.tMember(2), 1],
      // connect users
      [units.account.login.user(5), 2],
      [units.account.login.user(6), 3],
      [units.account.login.user(7), 4],
      [units.account.login.user(9), 5],
      [units.account.login.user(12), 6],
      [units.account.login.user(13), 7],
      [units.account.login.user(14), 8],
      // 9 vote 8
      [units.net.enter(2), 5],
      [units.vote.set.cMember(1), 5],
      // push events
      [units.events.vote.set, 1],
      // 10 vote 8
      [units.account.login.user(10), 1],
      [units.net.enter(2), 1],
      [units.vote.set.cMember(1), 1],
      // push events
      [units.events.vote.set, 5],
      // 11 vote 8
      [units.account.login.user(11), 1],
      [units.net.enter(2), 1],
      [units.vote.set.cMember(1), 1],
      // push events
      [units.events.vote.set, 5],
      // 8 vote 8
      [units.account.login.user(8), 1],
      [units.net.enter(2), 1],
      [units.vote.setFinal.self, 1],
      // push events
      [units.events.newEvents, 2],
      [units.events.newEvents, 3],
      [units.events.newEvents, 4],
      [units.events.newEvents, 1],
      [units.events.newEvents, 5],
      [units.events.newEvents, 6],
      [units.events.newEvents, 7],
      [units.events.newEvents, 8],
      // read events
      [units.events.read.voteForMembers, 5],
      [units.account.login.user(10), 5],
      [units.events.read.voteForMembers, 5],
      [units.account.login.user(11), 5],
      [units.events.read.voteForMembers, 5],
      [units.events.read.voteForConnectedInCircle, 6],
      [units.events.read.voteForVoteMember, 1],
      [units.events.read.voteForDisvoteMember, 4],
      [units.events.read.voteForMembersInTree, 7],
      [units.events.read.voteForConnectedInTree, 8],
      [units.events.read.voteForMembersInCircle, 3],
      [units.events.read.voteForMembersInCircle, 2],
      // check events all confirmed
      [units.events.check.confirmed, 0],
      // end of test
      [units.net.get.structure(2), 0],
    ],
  },
];
