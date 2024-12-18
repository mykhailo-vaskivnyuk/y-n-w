import assert from 'node:assert';
import { TTestUnit } from '../../types/types';

export const confirmed: TTestUnit = () => ({
  title: 'Check if all events confirmed',
  operations: [
    {
      name: 'EVENTS ALL CONFIRMED',
      query: () => execQuery.events.readAll([]),
      expectedQueryResult: (actual) => assert.deepEqual(actual, []),
    },
  ],
});
