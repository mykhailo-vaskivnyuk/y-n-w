import { TTestUnit } from '../../types/types';

const newEvents: TTestUnit = () => ({
  title: 'Wait event: NEW EVENTS',
  operations: [
    {
      name: 'NEW EVENTS',
      expected: { type: 'NEW_EVENTS' },
    },
  ],
});

export = newEvents;
