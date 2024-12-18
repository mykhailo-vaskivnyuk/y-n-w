/* eslint-disable max-lines */
import { IOperationData, TTestUnit } from '../../types/types';

export const root2: TTestUnit = (state: any) => ({
  title: 'create net',
  operations: [
    {
      name: '/net/create',
      params: { net_id: null, name: 'net 2' },
      expected: {
        goal: null,
        name: 'net 2',
        net_id: 2,
        net_level: 0,
        net_link: 'net_link',
        node_id: 20,
        parent_net_id: null,
        parent_node_id: null,
        total_count_of_members: 1,
      },
      setToState: (actual) => {
        state.net = { ...actual };
        actual.net_link = 'net_link';
      },
    },
    {
      name: 'query net',
      query: () => execQuery.net.get([state.net.net_id]),
      expectedQueryResult: () => [
        {
          goal: null,
          name: state.net.name,
          net_id: 2,
          net_level: 0,
          net_link: state.net.net_link,
          node_id: 20,
          parent_net_id: null,
          parent_node_id: null,
          total_count_of_members: 1,
        },
      ],
    },
    {
      name: '/net/update',
      params: () => ({
        node_id: state.net.node_id,
        goal: `goal of net ${state.net.name}`,
      }),
    },
    {
      name: '/net/getTree',
      params: () => ({ node_id: state.net.node_id }),
      setToState: (actual) => (state.tree = actual),
    },
  ] as IOperationData[],
});

export const first: TTestUnit = (state: any) => ({
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
        net_link: 'net_link',
        node_id: 20,
        parent_net_id: null,
        parent_node_id: null,
        total_count_of_members: 1,
      },
      setToState: (actual) => {
        state.net = { ...actual };
        actual.net_link = 'net_link';
      },
    },
    {
      name: 'query net',
      query: () => execQuery.net.get([state.net.net_id]),
      expectedQueryResult: () => [
        {
          goal: null,
          name: 'test net',
          net_id: 2,
          net_level: 0,
          net_link: state.net.net_link,
          node_id: 20,
          parent_net_id: null,
          parent_node_id: null,
          total_count_of_members: 1,
        },
      ],
    },
    {
      name: '/net/update',
      params: () => ({ node_id: state.net.node_id, goal: 'goal of net' }),
    },
    {
      name: '/net/getTree',
      params: () => ({ node_id: state.net.node_id }),
      setToState: (actual) => (state.tree = actual),
    },
  ] as IOperationData[],
});

export const second: TTestUnit = (state: any) => ({
  title: 'create net',
  operations: [
    {
      name: '/net/create',
      params: { net_id: null, name: 'test net second' },
      setToState: (actual) => (state.net = actual),
    },
    {
      name: '/net/update',
      params: () => ({
        node_id: state.net.node_id,
        goal: 'goal of net second',
      }),
    },
    {
      name: '/net/getTree',
      params: () => ({ node_id: state.net.node_id }),
      setToState: (actual) => (state.tree = actual),
    },
  ] as IOperationData[],
});
