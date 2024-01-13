import { TTestUnit } from '../../types/types';

const vote: TTestUnit = () => (
  {
    title: 'Wait event: VOTE',
    operations: [
      {
        name: 'VOTE',
        expected: {
          date: '',
          event_id: 0,
          event_type: 'VOTE',
          from_node_id: null,
          message: '',
          net_id: 5,
          net_view: 'circle',
          type: 'EVENT',
          user_id: 3
        },
      },
    ]
  });

export = vote;
