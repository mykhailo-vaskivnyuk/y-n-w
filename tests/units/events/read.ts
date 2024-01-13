/* eslint-disable max-lines */
import assert from 'node:assert';
import { IOperationData, TTestUnit } from '../../types/types';

export const leaveInTree: TTestUnit = (state: any) => (
  {
    title: 'read events',
    operations: [
      {
        name: '/events/read',
        params: { node_id: state.node_id },
        expected: (actual) => {
          const event = actual[0];
          assert.deepEqual([{
            event_type: event.event_type,
            message: event.message,
            net_view: event.net_view,
            user_id: event.user_id,
          }], [{
            // date: '2024-01-11T13:52:29.000Z',
            // event_id: 2,
            event_type: 'LEAVE',
            // from_node_id: 3,
            message: 'Від\'єднався учасник вашого дерева',
            // net_id: 1,
            net_view: 'tree',
            user_id: state.user_id,
          }]);
        },
      },
    ] as IOperationData[],
  });

export const leaveInCircle: TTestUnit = (state: any) => (
  {
    title: 'read events',
    operations: [
      {
        name: '/events/read',
        params: { node_id: state.node_id },
        expected: (actual) => {
          const event = actual[0];
          assert.deepEqual([{
            event_type: event.event_type,
            message: event.message,
            net_view: event.net_view,
            user_id: event.user_id,
          }], [{
            // date: '2024-01-11T13:52:29.000Z',
            // event_id: 2,
            event_type: 'LEAVE',
            // from_node_id: 3,
            message: 'Від\'єднався учасник кола',
            // net_id: 1,
            net_view: 'circle',
            user_id: state.user_id,
          }]);
        },
      },
    ] as IOperationData[],
  });

