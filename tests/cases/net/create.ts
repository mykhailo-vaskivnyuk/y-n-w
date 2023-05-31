import { ITestCase } from '../../types/types';

const create = (state: any): ITestCase => (
  {
    title: 'create net',
    operations: [
      {
        name: '/net/create',
        params: { net_id: null, name: 'test net' },
        expected: {
          goal: null,
          name: 'test net',
          net_id: 2,
          net_level: 0,
          node_id: 20,
          parent_net_id: null,
          parent_node_id: null,
          total_count_of_members: 1
        },
        toState: (expected) => {
          state.net_id = expected.net_id;
          state.node_id = expected.node_id;
        },
      },
      {
        name: '/net/update',
        params: () => ({ node_id: state.node_id, goal: 'goal of net' }),
      },
      {
        name: '/net/getTree',
        params: () => ({ node_id: state?.node_id }),
        toState: (expected) => state.tree = expected,
      }
    ]
  });

export = create;
