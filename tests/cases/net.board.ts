/* eslint-disable max-lines */
import { ITestUnitsMap } from '../types/test.units.types';
import { ITestCase } from '../types/types';

export const netVote = (units: ITestUnitsMap): ITestCase[] => [
  {
    title: 'Test BOARD IN NET 1 over WS',
    dbDataFile: 'notifications.sh',
    connection: 'ws',
    caseUnits: [
      [units.account.login.user(1), 1],
      // [units.account.login.user(3), 3],
      // write board message
      [units.net.enter(1), 1],
      [units.net.board.write, 1],
      // events
      // [units.events.newEvents, 3],
      [units.account.login.user(3), 3],
      [units.events.read.boardMessage, 3],
      [units.account.login.user(2), 2],
      [units.events.read.boardMessage, 2],
      //
      [units.events.check.confirmed, 0],
      [units.net.get.structure(1), 0],
    ],
  },
];
