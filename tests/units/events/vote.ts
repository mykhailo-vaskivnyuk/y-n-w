/* eslint-disable max-len */
import assert from 'node:assert';
import { TTestUnit } from '../../types/types';

export const set: TTestUnit = (state: any) => (
  {
    title: 'Wait event: VOTE',
    operations: [
      {
        name: 'VOTE',
        expected: (actual) => {
          assert.deepStrictEqual({
            event_type: actual.event_type,
            message: actual.message,
            net_id: actual.net_id,
            net_view: actual.net_view,
            type: actual.type,
            user_id: actual.user_id,
          }, {
            // date: '',
            // event_id: 0,
            event_type: 'VOTE',
            // from_node_id: null,
            message: 'Учасник вашого кола проголосував',
            net_id: state.net.net_id,
            net_view: 'circle',
            type: 'EVENT',
            user_id: state.user.user_id,
          });
        },
      },
    ]
  });
