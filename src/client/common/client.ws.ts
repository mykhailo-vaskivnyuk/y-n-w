import { logData, delay } from './utils';
import { TPromiseExecutor } from '../local/imports';
import { IWsResponse, TFetch } from './types';
import { HttpResponseError } from './errors';
import { CONECTION_ATTEMPT_COUNT, CONNECTION_DELAY } from './constants';

export const getConnection = async (baseUrl: string): Promise<TFetch> => {
  let requests: Map<any, number>;
  let socket: WebSocket;
  const createSocket = () => {
    requests = new Map<any, number>();
    socket = new WebSocket(baseUrl);
  };
  let id = 0;
  const getId = () => ++id % 100;

  const checkConnection = async (attempt = CONECTION_ATTEMPT_COUNT) => {
    !socket && createSocket();
    const { readyState, OPEN, CLOSING, CLOSED } = socket;
    if (readyState === OPEN) return;
    if (
      readyState === CLOSED ||
      readyState === CLOSING
    ) createSocket();

    const connectExecutor: TPromiseExecutor<void> = (rv, rj) => {
      const handleError = () => {
        if (attempt === 1) return rj(new HttpResponseError(503));
        delay(CONNECTION_DELAY).then(
          () => checkConnection(attempt - 1),
        ).then(rv).catch(rj);
      };
      const handleOpen = () => rv();
      socket.addEventListener('error', handleError);
      socket.addEventListener('open', handleOpen);
    };

    return new Promise<void>(connectExecutor);
  };

  const getResponseHandler = (...[rv, rj]: Parameters<TPromiseExecutor<any>>) =>
    function handler({ data: message }: MessageEvent) {
      const response = JSON.parse(message) as IWsResponse;
      logData(response, 'response');
      const { requestId: reqId, status, data: resData } = response;
      if (reqId && reqId !== requests.get(handler)) return;
      socket.removeEventListener('message', handler);
      requests.delete(handler);
      status !== 200 && rj(new HttpResponseError(status));
      rv(resData);
    };

  const createSendExecutor = (
    requestMessage: string,
  ): TPromiseExecutor<void> => (rv, rj) => {
    const handlerResponse = getResponseHandler(rv, rj);
    requests.set(handlerResponse, id);
    socket.addEventListener('message', handlerResponse);
    socket.send(requestMessage);
  };

  const createTrySendExecutor = (
    send: ReturnType<typeof createSendExecutor>,
  ): TPromiseExecutor<any> => (rv, rj) => {
    const handleTimeout = () => rj(new Error('Connection timeout'));
    const timer = setTimeout(handleTimeout, 3000);
    const newRv = (...args: Parameters<typeof rv>) => {
      clearTimeout(timer);
      rv(...args);
    };
    send(newRv, rj);
  };

  const fetch = async (
    pathname: string, data: Record<string, any> = {},
  ): Promise<any> => {
    await checkConnection();
    const requestId = getId();
    const request = { requestId, pathname, data };
    logData(request, 'request');
    const requestMessage = JSON.stringify(request);
    const sendExecutor = createSendExecutor(requestMessage);
    const trySendExecutor = createTrySendExecutor(sendExecutor);
    try {
      return await new Promise(trySendExecutor);
    } catch (e) {
      if (e instanceof HttpResponseError) throw e;
      socket.close();
      await checkConnection();
      return new Promise(sendExecutor);
    }
  };

  return fetch;
};
