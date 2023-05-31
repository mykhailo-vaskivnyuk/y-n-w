import assert from 'node:assert';
import { TTestCase } from '../../types/types';

const create: TTestCase = (state) => (
  {
    title: 'invite create',
    operations: [
      {
        name: '/member/invite/create',
        params: () => ({
          node_id: state.node_id,
          net_id: state.net_id,
          member_node_id: state.tree[0].node_id,
          member_name: 'first member',
        }),
        expected: (actual) => assert.equal(actual.length > 10, true),
        toState: (actual) => state.invite = actual,
      },
    ],
  });

export = create;
