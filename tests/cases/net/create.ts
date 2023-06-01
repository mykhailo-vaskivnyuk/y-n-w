import { ITestCase } from '../../types/types';

export const first = (state: any): ITestCase => (
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
        toState: (actual) => {
          state.net_id = actual.net_id;
          state.node_id = actual.node_id;
        },
      },
      {
        name: '/net/update',
        params: () => ({ node_id: state.node_id, goal: 'goal of net' }),
      },
      {
        name: '/net/getTree',
        params: () => ({ node_id: state?.node_id }),
        toState: (actual) => state.tree = actual,
      }
    ]
  });

export const second = (state: any): ITestCase => (
  {
    title: 'create net',
    operations: [
      {
        name: '/net/create',
        params: { net_id: null, name: 'test net second' },
        // expected: {
        //   goal: null,
        //   name: 'test net',
        //   net_id: 2,
        //   net_level: 0,
        //   node_id: 20,
        //   parent_net_id: null,
        //   parent_node_id: null,
        //   total_count_of_members: 1
        // },
        toState: (actual) => {
          state.net_id = actual.net_id;
          state.node_id = actual.node_id;
        },
      },
      {
        name: '/net/update',
        params: () => ({ node_id: state.node_id, goal: 'goal of net second' }),
      },
      {
        name: '/net/getTree',
        params: () => ({ node_id: state?.node_id }),
        toState: (actual) => state.tree = actual,
      }
    ]
  });
