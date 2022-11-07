import { TFetch } from './api/types';
import { IWsResponse, TPromiseExecutor } from './types';
import { HttpResponseError } from './errors';

export const getConnection = async (baseUrl: string): Promise<TFetch> => {
  const requests = new Map<any, number>();
  let id = 0;
  const getId = () => {
    id = (id + 1) % 100;
    return id;
  };

  const socket = new WebSocket(baseUrl);

  const getHandler = (...[rv, rj]: Parameters<TPromiseExecutor<any>>) =>
    function handler({ data: message }: MessageEvent) {
      const response = JSON.parse(message) as IWsResponse;
      const { requestId: reqId, status, data: resData } = response;
      console.log('response', response);
      if (reqId && reqId !== requests.get(handler)) return;
      socket.removeEventListener('message', handler);
      requests.delete(handler);
      if (status !== 200) rj(new HttpResponseError(status));
      rv(resData);
    };

  const fetch = async (pathname: string, data: Record<string, any> = {}): Promise<any> => {
    const requestId = getId();
    const request = { requestId, pathname, data };
    const requestMessage = JSON.stringify(request);
    console.log('request', request);
    socket.send(requestMessage);
    return new Promise((resolve, reject) => {
      const handler = getHandler(resolve, reject);
      requests.set(handler, id);
      socket.addEventListener('message', handler);
    });
  };

  return new Promise((resolve) => {
    socket.addEventListener('open', () => resolve(fetch));
  });
};
