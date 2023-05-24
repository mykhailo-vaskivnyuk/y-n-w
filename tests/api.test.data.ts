export const API_TEST_DATA: {
  task: string, operations: Array<{ name: string, params: any, response: any }>
}[] = [
  {
    task: 'health',
    operations: [
      {
        name: 'health',
        params: {},
        response: 'API IS READY',
      },
    ]
  },
  {
    task: 'login',
    operations: [
      {
        name: 'health',
        params: {},
        response: 'API IS READY',
      },
      {
        name: 'account/login',
        params: { email: 'user02@gmail.com', password: '12345' },
        response: {
          email: 'user02@gmail.com',
          mobile: null,
          name: null,
          user_id: 2,
          user_status: 'LOGGEDIN',
        },
      },
      {
        name: 'health',
        params: {},
        response: 'API IS READY',
      },
    ]
  },
];
