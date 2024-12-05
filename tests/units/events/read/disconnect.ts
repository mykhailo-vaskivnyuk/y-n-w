/* eslint-disable max-lines */
import assert from 'node:assert';
import { IOperationData, TTestUnit } from '../../../types/types';

const getDisconnectEvent =
  (event_type: string, message: string): TTestUnit =>
  (state: any) => ({
    title: 'read events',
    operations: [
      {
        name: '/events/read',
        params: {},
        setToState: (actual) => (state.events = actual),
        expected: (actual) => {
          const event = actual[0];
          assert.deepEqual(
            [
              {
                event_type: event.event_type,
                message: event.message.slice(0, 28),
                net_view: event.net_view,
                user_id: event.user_id,
              },
            ],
            [
              {
                event_type,
                message,
                net_view: null,
                user_id: state.user.user_id,
              },
            ],
          );
        },
      },
      {
        name: '/events/confirm',
        params: () => ({
          user_id: state.user.user_id,
          event_id: state.events.shift().event_id,
        }),
      },
    ] as IOperationData[],
  });

export const dislike = getDisconnectEvent(
  'DISLIKE_DISCONNECT',
  "Вас від'єднано від спільноти",
);

export const dislikeFacilitator = getDisconnectEvent(
  'DISLIKE_DISCONNECT',
  "Вас від'єднано від спільноти",
);

export const leaveFacilitator = getDisconnectEvent(
  'LEAVE',
  "Вас від'єднано від спільноти",
);
