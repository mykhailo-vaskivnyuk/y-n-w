/* eslint-disable max-lines */
import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const netVote = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Test VOTES IN NET 2 over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    connCount: 7,
    caseUnits: [
      [units.net.structure(2), 0],
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
      [units.net.structure(2), 0],
      // user 5 connect user 6
      [units.invite.create.tMember(0), 1],
      [units.account.login.user(6), 2],
      [units.net.connetByToken(2), 2],
      [units.invite.confirm.tMember(0), 1],
      // user 5 connect user 7
      [units.invite.create.tMember(1), 1],
      [units.account.login.user(7), 2],
      [units.net.connetByToken(2), 2],
      [units.invite.confirm.tMember(1), 1],
      // user 7 connect user 8
      [units.net.enter(2), 2],
      [units.invite.create.tMember(0), 2],
      [units.account.login.user(8), 1],
      [units.net.connetByToken(2), 1],
      [units.invite.confirm.tMember(0), 2],
      // user 7 connect user 9
      [units.invite.create.tMember(1), 2],
      [units.account.login.user(9), 1],
      [units.net.connetByToken(2), 1],
      [units.invite.confirm.tMember(1), 2],
      // user 7 connect user 10
      [units.invite.create.tMember(2), 2],
      [units.account.login.user(10), 1],
      [units.net.connetByToken(2), 1],
      [units.invite.confirm.tMember(2), 2],
      // user 7 connect user 11
      [units.invite.create.tMember(3), 2],
      [units.account.login.user(11), 1],
      [units.net.connetByToken(2), 1],
      [units.invite.confirm.tMember(3), 2],
      // user 7 connect user 12
      [units.invite.create.tMember(4), 2],
      [units.account.login.user(12), 1],
      [units.net.connetByToken(2), 1],
      // user 7 invite create
      [units.invite.create.tMember(5), 2],
      // user 8 connect user 13
      [units.account.login.user(8), 1],
      [units.net.enter(2), 1],
      [units.invite.create.tMember(0), 1],
      [units.account.login.user(13), 2],
      [units.net.connetByToken(2), 2],
      [units.invite.confirm.tMember(0), 1],
      // user 8 connect user 14
      [units.invite.create.tMember(1), 1],
      [units.account.login.user(14), 2],
      [units.net.connetByToken(2), 2],
      // user 8 invite create
      [units.invite.create.tMember(2), 1],
      // 9 vote 8
      [units.account.login.user(9), 2],
      [units.net.enter(2), 2],
      [units.vote.set.cMember(1), 2],
      // 10 vote 8
      [units.account.login.user(10), 2],
      [units.net.enter(2), 2],
      [units.vote.set.cMember(1), 2],
      // 11 vote 8
      [units.account.login.user(11), 2],
      [units.net.enter(2), 2],
      [units.vote.set.cMember(1), 2],
      // 8 vote 8
      [units.vote.setFinal.self, 1],
      //
      [units.net.structure(2), 0],
    ],
  },
];
