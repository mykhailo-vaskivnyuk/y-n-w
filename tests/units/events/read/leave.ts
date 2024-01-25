import assert from 'node:assert';
import { IOperationData, TTestUnit } from '../../../types/types';

export const inTree: TTestUnit = (state: any) => (
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
            event_type: 'LEAVE',
            message: 'Від\'єднався учасник вашого дерева',
            net_view: 'tree',
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

export const inCircle: TTestUnit = (state: any) => (
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
            event_type: 'LEAVE',
            message: 'Від\'єднався учасник кола',
            net_view: 'circle',
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
