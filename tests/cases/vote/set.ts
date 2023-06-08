import { TTestCase } from '../../types/types';

const set: TTestCase = () => (
  {
    title: 'Set vote',
    operations: [
      {
        name: '/member/data/vote/set',
        params: {
          node_id: 3,
          member_node_id: 5,
        },
      },
    ],
  });

export = set;
