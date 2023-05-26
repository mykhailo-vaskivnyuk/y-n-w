import { getConnection } from './http';

const connection = getConnection('http://127.0.0.1:8000/api');

const test = async () => {
  await connection('/health').then(console.log);
  await connection('/account/login', {
    email: 'user02@gmail.com',
    password: '12345',
  }).then(console.log);
  await connection('/user/read').then(console.log);
};

test();
