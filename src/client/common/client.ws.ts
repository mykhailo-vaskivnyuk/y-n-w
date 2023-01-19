/* eslint-disable max-lines */
import { IWsResponse, TFetch } from './types';
import { TPromiseExecutor } from '../local/imports';
import { IChatResponseMessage } from './api/types/types';
import {
  CONECTION_ATTEMPT_COUNT, CONNECTION_ATTEMPT_DELAY, CONNECTION_TIMEOUT,
} from './constants';
import { HttpResponseError } from './errors';
import { logData, delay } from './utils';

class WsConnection {
  private chats = new Set<number>();
  private socket: WebSocket;
  private requests: Map<number, (response: IWsResponse) => void>;
  private id = 0;
  private pingTimeout: NodeJS.Timeout;

  constructor(
    private baseUrl: string,
    private onChatMessage: (message: IChatResponseMessage) => void,
  ) {
    this.handleResponse = this.handleResponse.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
  }

  createSocket() {
    this.requests = new Map();
    this.socket = new WebSocket(this.baseUrl);
  }

  getId() { return ++this.id % 100; }

  handleResponse({ data: messageData }: MessageEvent) {
    if (messageData === 'ping') return this.health();
    const response = JSON.parse(messageData) as IWsResponse;
    const { requestId: reqId, data } = response;
    if (reqId === undefined) {
      const { chatId } = data || {};
      if (!chatId) return;
      this.chats.add(chatId);
      this.onChatMessage(data);
      return;
    }
    logData(response, 'RES');
    const handleResponseWithId = this.requests.get(reqId);
    if (!handleResponseWithId) return;
    this.requests.delete(reqId);
    handleResponseWithId(response);
  }

  health() {
    clearTimeout(this.pingTimeout);
    this.pingTimeout = setTimeout(() => {
      this.socket.close();
      this.checkConnection();
    }, 5000 + 2000);
  }

  getResponseHandler(...[rv, rj]: Parameters<TPromiseExecutor<any>>) {
    return (response: IWsResponse) => {
      const { data, status } = response;
      if (status === 200) return rv(data);
      rj(new HttpResponseError(status));
    };
  }

  createSendExecutor(requestMessage: string): TPromiseExecutor<void> {
    return (rv, rj) => {
      const handleResponseWithId = this.getResponseHandler(rv, rj);
      this.requests.set(this.id, handleResponseWithId);
      this.socket.send(requestMessage);
    };
  }

  createSendWithTimeoutExecutor(requestMessage: string): TPromiseExecutor<any> {
    return (rv, rj) => {
      const send = this.createSendExecutor(requestMessage);
      const handleTimeout = () => rj(new HttpResponseError(503));
      const timer = setTimeout(handleTimeout, CONNECTION_TIMEOUT);
      const newRv = (...args: Parameters<typeof rv>) => {
        clearTimeout(timer);
        rv(...args);
      };
      send(newRv, rj);
    };
  }

  async fetch(
    pathname: string,
    data: Record<string, any> = {},
    doLog?: boolean,
  ): Promise<any> {
    const requestId = this.getId();
    const request = { requestId, pathname, data };
    doLog && logData(request, 'REQ');
    const requestMessage = JSON.stringify(request);
    const sendWithTimeoutExecutor =
      this.createSendWithTimeoutExecutor(requestMessage);
    return new Promise(sendWithTimeoutExecutor);
  }

  async sendRequest(
    pathname: string,
    data: Record<string, any> = {},
  ): Promise<any> {
    await this.checkConnection();
    return this.fetch(pathname, data);
  }

  async checkConnection(attempt = CONECTION_ATTEMPT_COUNT) {
    !this.socket && this.createSocket();
    const { readyState, OPEN, CLOSING, CLOSED } = this.socket;
    if (readyState === OPEN) return;
    if (readyState === CLOSED || readyState === CLOSING)
      this.createSocket();

    const connectExecutor: TPromiseExecutor<void> = (rv, rj) => {
      const handleError = () => {
        if (attempt === 1) return rj(new HttpResponseError(503));
        delay(CONNECTION_ATTEMPT_DELAY)
          .then(() => this.checkConnection(attempt - 1))
          .then(rv).catch(rj);
      };

      const handleOpen = () => {
        this.health();
        for (const chatId of this.chats.values())
          this.fetch('/net/chat/send', { chatId }, false);
        rv();
      };

      const handleClose = () => clearTimeout(this.pingTimeout);

      this.socket.addEventListener('error', handleError);
      this.socket.addEventListener('open', handleOpen);
      this.socket.addEventListener('message', this.handleResponse);
      this.socket.addEventListener('close', handleClose);
    };

    return new Promise<void>(connectExecutor);
  }
}

export const getConnection = (
  baseUrl: string,
  onChatMessage: (message: IChatResponseMessage) => void,
): TFetch => new WsConnection(baseUrl, onChatMessage).sendRequest;
