import { TTestCase } from '../../types/types';

export const user02: TTestCase = () => (
  {
    title: 'login',
    operations: [
      {
        name: '/health',
        expected: 'API IS READY',
      },
      {
        name: '/account/login',
        params: { email: 'user02@gmail.com', password: '12345' },
        expected: {
          email: 'user02@gmail.com',
          mobile: null,
          name: null,
          user_id: 2,
          user_status: 'LOGGEDIN',
        },
      },
    ],
  });

export const user03: TTestCase = () => (
  {
    title: 'login',
    operations: [
      {
        name: '/health',
        expected: 'API IS READY',
      },
      {
        name: '/account/login',
        params: { email: 'user03@gmail.com', password: '12345' },
        expected: {
          email: 'user03@gmail.com',
          mobile: null,
          name: null,
          user_id: 3,
          user_status: 'LOGGEDIN',
        },
      },
    ],
  });
