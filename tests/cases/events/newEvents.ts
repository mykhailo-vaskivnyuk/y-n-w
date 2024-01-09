import { ITestCase } from '../../types/types';

const newEvents = (): ITestCase => (
  {
    title: 'Wait event: NEW EVENTS',
    operations: [
      {
        name: 'NEW EVENTS',
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

export = newEvents;
