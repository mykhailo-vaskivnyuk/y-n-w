import { ITestCase } from '../../types/types';

const newEvents = (): ITestCase => (
  {
    title: 'Wait event: NEW EVENTS',
    operations: [
      {
        name: 'NEW EVENTS',
        expected: {
          type: 'NEW_EVENTS',
        },
      },
    ]
  });

export = newEvents;
