/* eslint-disable max-lines */
import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const netVote = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Test DISLIKES IN NET 2 over WS',
    dbDataFile: 'restore.sh',
    connection: 'ws',
    connCount: 8,
    caseUnits: [
      [units.net.get.structure(2), 0],
      // singup users 5...11
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
      // user 5 create net 2
      [units.account.login.user(5), 1],
      [units.net.create.root2, 1],
      [units.net.get.structure(2), 0],
      // user 5 connect user 6
      [units.invite.create.tMember(0), 1],
      [units.account.login.user(6), 2],
      [units.net.connectByToken.toNet(2), 2],
      [units.events.instant.connect, 1],
      [units.invite.confirm.tMember(0), 1],
      // user 5 dislike user 6
      [units.dislike.set.tMember(0), 1],
      // user 5 connect user 7
      [units.invite.create.tMember(1), 1],
      [units.account.login.user(7), 3],
      [units.net.connectByToken.toNet(2), 3],
      [units.events.instant.connect, 1],
      [units.invite.confirm.tMember(1), 1],
      // user 7 dislike user 6
      [units.net.enter(2), 3],
      [units.dislike.setFinal.cMember(1), 3],
      // events
      [units.events.newEvents, 1],
      [units.events.newEvents, 2],
      [units.events.newEvents, 3],
      [units.events.read.leave.dislikeInTree, 1],
      [units.events.read.leave.dislikeInCircle, 3],
      [units.events.read.disconnect.dislike, 2],
      // user 5 connect user 6
      [units.invite.create.tMember(0), 1],
      [units.account.login.user(6), 2],
      [units.net.connectByToken.toNet(2), 2],
      [units.events.instant.connect, 1],
      [units.invite.confirm.tMember(0), 1],
      // user 5 connect user 8
      [units.invite.create.tMember(2), 1],
      [units.account.login.user(8), 4],
      [units.net.connectByToken.toNet(2), 4],
      [units.events.instant.connect, 1],
      [units.invite.confirm.tMember(2), 1],
      // user 5 dislike user 6
      [units.dislike.set.tMember(0), 1],
      // user 7 dislike user 6
      [units.dislike.set.cMember(1), 3],
      // user 8 dislike user 6
      [units.net.enter(2), 4],
      [units.dislike.setFinal.cMember(1), 4],
      // events
      [units.events.newEvents, 1],
      [units.events.newEvents, 2],
      [units.events.newEvents, 3],
      [units.events.newEvents, 4],
      [units.events.read.leave.dislikeInTree, 1],
      [units.events.read.leave.dislikeInCircle, 3],
      [units.events.read.leave.dislikeInCircle, 4],
      [units.events.read.disconnect.dislike, 2],
      // user 5 connect user 6
      [units.invite.create.tMember(0), 1],
      [units.account.login.user(6), 2],
      [units.net.connectByToken.toNet(2), 2],
      [units.events.instant.connect, 1],
      [units.invite.confirm.tMember(0), 1],
      // user 5 connect user 9
      [units.invite.create.tMember(3), 1],
      [units.account.login.user(9), 5],
      [units.net.connectByToken.toNet(2), 5],
      [units.events.instant.connect, 1],
      [units.invite.confirm.tMember(3), 1],
      // user 5 dislike user 6
      [units.dislike.set.tMember(0), 1],
      // user 7 dislike user 6
      [units.dislike.set.cMember(1), 3],
      // user 8 dislike user 6
      [units.dislike.setFinal.cMember(1), 4],
      // events
      [units.events.newEvents, 1],
      [units.events.newEvents, 2],
      [units.events.newEvents, 3],
      [units.events.newEvents, 4],
      [units.events.newEvents, 5],
      [units.events.read.leave.dislikeInTree, 1],
      [units.events.read.leave.dislikeInCircle, 3],
      [units.events.read.leave.dislikeInCircle, 4],
      [units.events.read.leave.dislikeInCircle, 5],
      [units.events.read.disconnect.dislike, 2],
      // user 5 connect user 6
      [units.invite.create.tMember(0), 1],
      [units.account.login.user(6), 2],
      [units.net.connectByToken.toNet(2), 2],
      [units.events.instant.connect, 1],
      [units.invite.confirm.tMember(0), 1],
      // user 5 connect user 10
      [units.invite.create.tMember(4), 1],
      [units.account.login.user(10), 6],
      [units.net.connectByToken.toNet(2), 6],
      [units.events.instant.connect, 1],
      // user 5 dislike user 6
      [units.dislike.set.tMember(0), 1],
      // user 7 dislike user 6
      [units.dislike.set.cMember(1), 3],
      // user 8 dislike user 6
      [units.dislike.setFinal.cMember(1), 4],
      // events
      [units.events.newEvents, 1],
      [units.events.newEvents, 2],
      [units.events.newEvents, 3],
      [units.events.newEvents, 4],
      [units.events.newEvents, 5],
      [units.events.read.leave.dislikeInTree, 1],
      [units.events.read.leave.dislikeInCircle, 3],
      [units.events.read.leave.dislikeInCircle, 4],
      [units.events.read.leave.dislikeInCircle, 5],
      [units.events.read.disconnect.dislike, 2],
      // user 5 confirm user 10
      [units.invite.confirm.tMember(4), 1],
      // user 5 connect user 6
      [units.invite.create.tMember(0), 1],
      [units.account.login.user(6), 2],
      [units.net.connectByToken.toNet(2), 2],
      [units.events.instant.connect, 1],
      [units.invite.confirm.tMember(0), 1],
      // user 5 dislike user 6
      [units.dislike.set.tMember(0), 1],
      // user 7 dislike user 6
      [units.dislike.set.cMember(1), 3],
      // user 8 dislike user 6
      [units.dislike.set.cMember(1), 4],
      // user 9 dislike user 6
      [units.net.enter(2), 5],
      [units.dislike.setFinal.cMember(1), 5],
      // events
      [units.events.newEvents, 1],
      [units.events.newEvents, 2],
      [units.events.newEvents, 3],
      [units.events.newEvents, 4],
      [units.events.newEvents, 5],
      [units.events.newEvents, 6],
      [units.events.read.leave.dislikeInTree, 1],
      [units.events.read.leave.dislikeInCircle, 3],
      [units.events.read.leave.dislikeInCircle, 4],
      [units.events.read.leave.dislikeInCircle, 5],
      [units.events.read.leave.dislikeInCircle, 6],
      [units.events.read.disconnect.dislike, 2],
      // user 5 connect user 6
      [units.invite.create.tMember(0), 1],
      [units.account.login.user(6), 2],
      [units.net.connectByToken.toNet(2), 2],
      [units.events.instant.connect, 1],
      [units.invite.confirm.tMember(0), 1],
      // user 5 connect user 11
      [units.invite.create.tMember(5), 1],
      [units.account.login.user(11), 7],
      [units.net.connectByToken.toNet(2), 7],
      [units.events.instant.connect, 1],
      [units.invite.confirm.tMember(5), 1],
      // user 5 dislike user 6
      [units.dislike.set.tMember(0), 1],
      // user 7 dislike user 6
      [units.dislike.set.cMember(1), 3],
      // user 8 dislike user 6
      [units.dislike.set.cMember(1), 4],
      // user 9 dislike user 6
      [units.dislike.setFinal.cMember(1), 5],
      // events
      [units.events.newEvents, 1],
      [units.events.newEvents, 2],
      [units.events.newEvents, 3],
      [units.events.newEvents, 4],
      [units.events.newEvents, 5],
      [units.events.newEvents, 6],
      [units.events.newEvents, 7],
      [units.events.read.leave.dislikeInTree, 1],
      [units.events.read.leave.dislikeInCircle, 3],
      [units.events.read.leave.dislikeInCircle, 4],
      [units.events.read.leave.dislikeInCircle, 5],
      [units.events.read.leave.dislikeInCircle, 6],
      [units.events.read.leave.dislikeInCircle, 7],
      [units.events.read.disconnect.dislike, 2],
      // user 5 connect user 6
      [units.invite.create.tMember(0), 1],
      [units.account.login.user(6), 2],
      [units.net.connectByToken.toNet(2), 2],
      [units.events.instant.connect, 1],
      // user 7 dislike user 5
      [units.dislike.set.cMember(0), 3],
      // user 8 dislike user 5
      [units.dislike.set.cMember(0), 4],
      // user 9 dislike user 5
      [units.dislike.set.cMember(0), 5],
      // user 10 dislike user 5
      [units.net.enter(2), 6],
      [units.dislike.setFinal.cMember(0), 6],
      // events
      [units.events.newEvents, 1],
      [units.events.newEvents, 2],
      [units.events.newEvents, 3],
      [units.events.newEvents, 4],
      [units.events.newEvents, 5],
      [units.events.newEvents, 6],
      [units.events.newEvents, 7],
      [units.events.read.disconnect.dislikeFacilitator, 2],
      [units.events.read.leave.dislikeFacilitator, 3],
      [units.events.read.leave.dislikeFacilitator, 4],
      [units.events.read.leave.dislikeFacilitator, 5],
      [units.events.read.leave.dislikeFacilitator, 6],
      [units.events.read.leave.dislikeFacilitator, 7],
      [units.events.read.disconnect.dislike, 1],
      // check events all confirmed
      [units.events.check.confirmed, 0],
      // end of test
      [units.net.get.structure(2), 0],
    ],
  },
];
