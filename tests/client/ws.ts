import { WebSocket } from 'ws';

let Cookie = '';
export const getConnection = (baseUrl: string) =>
  async (url: string, data: Record<string, any> = {}) => {
    console.log(' ');
    // logData(data, 'REQ');
    const options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: `${Cookie};` },
      body: JSON.stringify(data),
      credentials: 'include',
    };
    try {
      const response = await fetch(baseUrl + url, options);
      const { ok, status } = response;
      // HttpResponseError(status as HttpResponseErrorCode);
      if (!ok) throw new Error(`http error: ${status}`);
      const responseData = await response.json();
      Cookie = response.headers.get('set-cookie')?.split(/; ?/)[0] || Cookie;
      // logData(responseData, 'RES');
      return responseData;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

const httpConnection = getConnection('http://localhost:8000/api');

const ws = new WebSocket('ws://localhost:8000/api/');
const connection = (url: string, data: Record<string, any> = {}) => {
  const message = JSON.stringify({ pathname: url, data });
  ws.send(message);

  return new Promise((rv) => {
    const onResponse = (data: string) => {
      const response = JSON.parse(data);
      rv(response);
    };
    ws.once('message', onResponse);
  });
};

const test = async () => {
  await new Promise((rv) => ws.on('open', rv));
  await httpConnection('/health').then(console.log).catch(() => false);
  await connection('/health', {}).then(console.log);
  await connection('/account/login', {
    email: 'user02@gmail.com',
    password: '12345',
  }).then(console.log);
  await connection('/user/read').then(console.log);
};

test();
