import assert from 'node:assert';
import { IOperationData, TTestUnit } from '../../../types/types';

/* event
  date: '2024-01-11T13:52:29.000Z',
  event_id: 2,
  event_type: 'CONNECT_VOTE',
  from_node_id: 3,
  message: 'Учасника вашого кола обрано координатором',
  net_id: 1,
  net_view: 'circle',
  user_id: state.user.user_id,
*/

export const getEvent =
  (event_type: string, net_view: string | null, message: string): TTestUnit =>
  (state: any) => ({
    title: `read event ${event_type}`,
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
                message: event.message,
                net_view: event.net_view,
                user_id: event.user_id,
              },
            ],
            [
              {
                event_type,
                message,
                net_view,
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

export const confirm = getEvent(
  'CONFIRM',
  'net',
  'Координатор підтвердив вашу участь в спільноті',
);

export const confirmInCircle = getEvent(
  'CONFIRM',
  'circle',
  'У колі новий учасник',
);

export const connect = getEvent('CONNECT', 'tree', 'У дереві новий учасник');

export const connectAndConfirmInTree = getEvent(
  'CONNECT_AND_CONFIRM',
  'tree',
  'У дереві новий учасник',
);

export const connectAndConfirmInCircle = getEvent(
  'CONNECT_AND_CONFIRM',
  'circle',
  'У колі новий учасник',
);

export const boardMessage = getEvent('BOARD_MESSAGE', 'net', 'Зміни на дошці');

export const tightenInTree = getEvent(
  'TIGHTEN',
  'tree',
  'У вашому дереві новий учасник, через стискання спільноти',
);

export const tighten = getEvent(
  'TIGHTEN',
  'net',
  'У вас нове коло, через стискання спільноти',
);
