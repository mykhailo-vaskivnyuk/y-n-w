/* eslint-disable max-lines */
import { logData, delay } from './utils';
import { TPromiseExecutor } from '../local/imports';
import { IWsResponse, TFetch, TOnChatMessage } from './types';
import { HttpResponseError } from './errors';
import {
  CONECTION_ATTEMPT_COUNT, CONNECTION_ATTEMPT_DELAY, CONNECTION_TIMEOUT,
} from './constants';

interface IGetConnectionReturn {
  connection: TFetch;
  setOnChatMessage: (onChatMessage: TOnChatMessage) => void;
}

export const getConnection = async (
  baseUrl: string,
): Promise<IGetConnectionReturn> => {
  let onChatMessage: null | ((data: any) => void) = null;
  let requests: Map<number, (response: IWsResponse) => void>;
  let socket: WebSocket;
  const createSocket = () => {
    requests = new Map();
    socket = new WebSocket(baseUrl);
  };
  let id = 0;
  const getId = () => ++id % 100;

  function handleResponseMessage({ data: message }: MessageEvent) {
    const response = JSON.parse(message) as IWsResponse;
    logData(response, 'RES');
    const { requestId: reqId, data } = response;
    if (!reqId) {
      if (data?.chatId && onChatMessage) {
        console.log(response);
        onChatMessage(data);
      }
      return;
    }
    const handleResponse = requests.get(reqId);
    if (!handleResponse) return;
    requests.delete(reqId);
    handleResponse(response);
  }

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
        delay(CONNECTION_ATTEMPT_DELAY).then(
          () => checkConnection(attempt - 1),
        ).then(rv).catch(rj);
      };
      const handleOpen = () => rv();
      socket.addEventListener('error', handleError);
      socket.addEventListener('open', handleOpen);
      socket.addEventListener('message', handleResponseMessage);
    };

    return new Promise<void>(connectExecutor);
  };

  const getResponseHandler = (...[rv, rj]: Parameters<TPromiseExecutor<any>>) =>
    (response: IWsResponse) => {
      const { data, status } = response;
      if (status === 200) return rv(data);
      rj(new HttpResponseError(status));
    };

  const createSendExecutor = (
    requestMessage: string,
  ): TPromiseExecutor<void> => (rv, rj) => {
    const handleResponse = getResponseHandler(rv, rj);
    requests.set(id, handleResponse);
    socket.send(requestMessage);
  };

  const createSendWithTimeoutExecutor = (
    requestMessage: string,
  ): TPromiseExecutor<any> => (rv, rj) => {
    const send = createSendExecutor(requestMessage);
    const handleTimeout = () => rj(new HttpResponseError(503));
    const timer = setTimeout(handleTimeout, CONNECTION_TIMEOUT);
    const newRv = (...args: Parameters<typeof rv>) => {
      clearTimeout(timer);
      rv(...args);
    };
    send(newRv, rj);
  };

  const connection = async (
    pathname: string,
    data: Record<string, any> = {},
  ): Promise<any> => {
    await checkConnection();
    const requestId = getId();
    const request = { requestId, pathname, data };
    logData(request, 'REQ');
    const requestMessage = JSON.stringify(request);
    const sendWithTimeoutExecutor = createSendWithTimeoutExecutor(
      requestMessage,
    );
    return new Promise(sendWithTimeoutExecutor);
  };

  const setOnChatMessage = (cb: null | ((data: any) => void) = null) => {
    // console.log('CALLBACK', cb);
    onChatMessage = cb;
  };

  return { connection, setOnChatMessage };
};
