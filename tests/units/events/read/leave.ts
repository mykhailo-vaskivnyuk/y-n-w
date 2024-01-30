import assert from 'node:assert';
import { IOperationData, TTestUnit } from '../../../types/types';

const getLeaveEvent = (
  net_view: string | null,
  event_type: string,
  message: string,
): TTestUnit => (state: any) => (
  {
    title: 'read events',
    operations: [
      {
        name: '/events/read',
        params: {},
        setToState: (actual) => state.events = actual,
        expected: (actual) => {
          const event = actual[0];
          assert.deepEqual([{
            event_type: event.event_type,
            message: event.message,
            net_view: event.net_view,
            user_id: event.user_id,
          }], [{
            event_type,
            message,
            net_view,
            user_id: state.user.user_id,
          }]);
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

export const dislikeInTree = getLeaveEvent(
  'tree',
  'DISLIKE_DISCONNECT',
  'Учасника вашого дерева від\'єднано через діслайки',
);

export const dislikeInCircle = getLeaveEvent(
  'circle',
  'DISLIKE_DISCONNECT',
  'Учасника вашого кола від\'єднано через діслайки',
);

export const dislikeFacilitator = getLeaveEvent(
  'circle',
  'DISLIKE_DISCONNECT',
  'Вашого координатора від\'єднано через діслайки',
);

export const inTree = getLeaveEvent(
  'tree',
  'LEAVE',
  'Від\'єднався учасник дерева',
);

export const inCircle = getLeaveEvent(
  'circle',
  'LEAVE',
  'Від\'єднався учасник кола',
);
