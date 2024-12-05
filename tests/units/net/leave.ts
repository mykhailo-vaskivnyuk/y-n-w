import { ITestUnit } from '../../types/types';

const leave = (state: any): ITestUnit => ({
  title: 'leave net 1',
  operations: [
    {
      name: '/net/leave',
      params: () => ({ node_id: state.net.node_id }),
    },
  ],
});

export = leave;
