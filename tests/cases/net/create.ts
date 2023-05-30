import { ITestCase } from '../../types/types';

const login = (state: any): ITestCase => (
  {
    task: 'net',
    operations: [
      {
        name: '/health',
        params: { value: state.value || null },
        response: 'API IS READY',
      },
      {
        name: '/account/login',
        params: { email: 'user02@gmail.com', password: '12345' },
        response: {
          email: 'user02@gmail.com',
          mobile: null,
          name: null,
          user_id: 2,
          user_status: 'LOGGEDIN',
        },
      },
    ]
  });

export = login;
