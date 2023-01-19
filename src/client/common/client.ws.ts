/* eslint-disable max-lines */
import { logData, delay } from './utils';
import { TPromiseExecutor } from '../local/imports';
import { IWsResponse, TFetch } from './types';
import { IChatResponseMessage } from './api/types/chat.types';
import {
  CONECTION_ATTEMPT_COUNT, CONNECTION_ATTEMPT_DELAY, CONNECTION_TIMEOUT,
} from './constants';
import { HttpResponseError } from './errors';

const CHATS = new Set<number>();

export const getConnection = (
  baseUrl: string, onChatMessage?: (message: IChatResponseMessage) => void,
): TFetch => {
  let requests: Map<number, (response: IWsResponse) => void>;
  let socket: WebSocket;
  const createSocket = () => {
    requests = new Map();
    socket = new WebSocket(baseUrl);
  };
  let id = 0;
  const getId = () => ++id % 100;
  let pingTimeout: NodeJS.Timeout;

  function handleResponseMessage(
    this: WebSocket, { data: message }: MessageEvent,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (message === 'ping') return health.call(this);

    const response = JSON.parse(message) as IWsResponse;
    logData(response, 'RES');
    const { requestId: reqId, data } = response;
    if (reqId === undefined) {
      const { chatId } = data || {};
      if (chatId && onChatMessage) {
        console.log('CHAT MESS', data);
        CHATS.add(chatId);
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
      function handleOpen(this: WebSocket) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        health.call(this);
        // send empty messages in order to connect to chats
        for (const chatId of CHATS.values()) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          connection('/net/chat/send', { chatId });
        }
        rv();
      }

      socket.addEventListener('error', handleError);
      socket.addEventListener('open', handleOpen);
      socket.addEventListener('message', handleResponseMessage);
      socket.addEventListener('close', () => {
        console.log('CLOSE');
        clearTimeout(pingTimeout);
      });
    };

    return new Promise<void>(connectExecutor);
  };

  function health(this: WebSocket) {
    clearTimeout(pingTimeout);
    pingTimeout = setTimeout(() => {
      this.close();
      checkConnection();
    }, 5000 + 2000);
  }

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

  async function connection(
    pathname: string,
    data: Record<string, any> = {},
  ): Promise<any> {
    await checkConnection();
    const requestId = getId();
    const request = { requestId, pathname, data };
    logData(request, 'REQ');
    const requestMessage = JSON.stringify(request);
    const sendWithTimeoutExecutor = createSendWithTimeoutExecutor(
      requestMessage,
    );
    return new Promise(sendWithTimeoutExecutor);
  }

  return connection;
};
