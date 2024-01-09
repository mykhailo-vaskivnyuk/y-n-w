import { ITestCase } from '../../types/types';

export const parent = (state: any): ITestCase => (
  {
    title: 'leave net 1',
    operations: [
      {
        name: '/net/leave',
        params: () => ({ node_id: state.node_id }),
      },
    ]
  });
