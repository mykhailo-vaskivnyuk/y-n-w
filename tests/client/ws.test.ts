import { getConnection } from './ws';

const [connection1, close1] = getConnection('ws://localhost:8000/api/', () => false, () => false, '123');
const [connection2, close2] = getConnection('ws://localhost:8000/api/', () => false, () => false, '456');

const test1 = async () => {
  await connection1('/health').then(console.log);
  await connection1('/account/login', {
    email: 'user02@gmail.com',
    password: '12345',
  }).then(console.log);
  await connection1('/user/read').then(console.log);
  await connection1('/net/create', {
    net_id: null,
    name: 'New net',
  }).then(console.log);
};

const test2 = async () => {
  await connection2('/health').then(console.log);
  await connection2('/account/login', {
    email: 'user03@gmail.com',
    password: '12345',
  }).then(console.log);
  await connection2('/user/read').then(console.log);
  await connection2('/net/create', {
    net_id: null,
    name: 'New net',
  }).then(console.log);
};

test1()
  .then(close1)
  .then(test2)
  .then(close2);
