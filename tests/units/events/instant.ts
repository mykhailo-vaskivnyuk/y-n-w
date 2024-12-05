/* eslint-disable max-len */
import assert from 'node:assert';
import { TTestUnit } from '../../types/types';

const getEvent =
  (event_type: string, net_view: string, message: string): TTestUnit =>
  (state: any) => ({
    title: `Wait event: ${event_type}`,
    operations: [
      {
        name: event_type,
        expected: (actual) => {
          assert.deepStrictEqual(
            {
              event_type: actual.event_type,
              message: actual.message,
              net_id: actual.net_id,
              net_view: actual.net_view,
              type: actual.type,
              user_id: actual.user_id,
            },
            {
              event_type,
              message,
              net_id: state.net.net_id,
              net_view,
              type: 'EVENT',
              user_id: state.user.user_id,
            },
          );
        },
      },
    ],
  });

export const vote = getEvent(
  'VOTE',
  'circle',
  'Учасник вашого кола проголосував',
);
