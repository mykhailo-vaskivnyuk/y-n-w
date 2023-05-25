// import { getApi } from '../../src/client/common/server/client.api';

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

// const api = getApi(getConnection('http://127.0.0.1:8000/api/'));
const connection = getConnection('http://127.0.0.1:8000/api');
const test = async () => {
  await connection('/health').then(console.log);
  await connection('/account/login', {
    email: 'user02@gmail.com',
    password: '12345',
  }).then(console.log);
  await connection('/user/read').then(console.log);
  // await api.user.nets.get().then(console.log);
};

test();
