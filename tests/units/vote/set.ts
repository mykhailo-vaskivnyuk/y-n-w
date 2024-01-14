import assert from 'node:assert';
import { IOperationData, TTestUnit } from '../../types/types';

export const self: TTestUnit = (state: any) => (
  {
    title: 'Set vote',
    operations: [
      {
        name: '/member/data/vote/set',
        params: {
          node_id: state.node_id,
          member_node_id: state.node_id,
        },
      },
      {
        name: '/net/getCircle',
        params: { node_id: state.node_id },
        expected: (actual) => {
          const mbers = actual.filter(({ vote }: any) => vote);
          assert(mbers.length === 0);
        },
      },
      {
        name: '/user/net/getData',
        params: { net_id: state.net_id },
        expected: (actual) => {
          assert(actual.vote);
        },
      },
    ] as IOperationData[],
  });

const set = (m: number): TTestUnit => (state: any) => (
  {
    title: `Set vote for circle[${m}]`,
    operations: [
      {
        name: '/member/data/vote/set',
        params: {
          node_id: state.node_id,
          member_node_id: state.circle[m].node_id,
        },
      },
      {
        name: '/net/getCircle',
        params: { node_id: state.node_id },
        expected: (actual) => {
          const mbers = actual.filter(({ vote }: any) => vote);
          assert(mbers.length === 1 && mbers[0].vote === true);
        },
      },
    ] as IOperationData[],
  });

export const mber1 = set(1);
export const mber2 = set(2);
export const mber3 = set(3);
export const mber4 = set(4);
export const mber5 = set(5);
