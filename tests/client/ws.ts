/* eslint-disable max-lines */
import { WebSocket } from 'ws';
import {
  IWsResponse, TFetch,
} from '../../src/client/common/client/connection/types';
import { TPromiseExecutor } from '../../src/client/common/types';
import {
  CONNECTION_ATTEMPT_COUNT, CONNECTION_ATTEMPT_DELAY,
  CONNECTION_TIMEOUT,
} from '../../src/client/common/client/constants';
import { PING_INTERVAL } from '../../src/client/common/server/constants';
import {
  HttpResponseError,
} from '../../src/client/common/client/connection/errors';
import { EventEmitter } from '../../src/client/common/client/lib/event.emitter';
import { delay } from '../../src/client/common/client/connection/utils';
import { createUnicCode } from '../../src/utils/crypto';

class WsConnection extends EventEmitter {
  private socket!: WebSocket;
  private pingTimeout!: NodeJS.Timeout;
  private connecting = false;
  private closed = false;
  private attempts = 0;
  private id = 0;
  private requests!: Map<number, (response: IWsResponse) => void>;
  private sessionKey: string;

  constructor(private baseUrl: string) {
    super();
    this.handleOpen = this.handleOpen.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.closeConnection = this.closeConnection.bind(this);
    this.sessionKey = createUnicCode(10);
  }

  private checkConnection() {
    this.attempts = 0;
    this.createConnection();
    if (!this.connecting) return;
    const executor: TPromiseExecutor<void> = (rv, rj) => {
      const timeout = setTimeout(() => {
        this.remove('connection', rv);
        this.remove('error', rj);
        rj(new HttpResponseError(503));
      }, CONNECTION_TIMEOUT);

      this.once('connection', () => clearTimeout(timeout));
      this.once('error', () => clearTimeout(timeout));
      this.once('connection', rv);
      this.once('error', rj);
    };

    return new Promise(executor);
  }

  closeConnection() {
    this.closed = true;
    this.socket?.close();
  }

  async createConnection() {
    if (this.connecting || this.closed) return;
    this.connecting = true;
    !this.socket && this.createSocket();
    const { readyState, OPEN, CONNECTING } = this.socket;
    if (readyState === OPEN) {
      this.connecting = false;
      return;
    }
    if (readyState !== CONNECTING) this.createSocket();
    this.attempts += 1;
    this.socket.addEventListener('error', this.handleError);
    this.socket.addEventListener('open', this.handleOpen);
    this.socket.on('message', this.handleMessage);
  }

  createSocket() {
    clearTimeout(this.pingTimeout);
    this.requests = new Map();
    const Cookie = `sessionKey=${this.sessionKey}`;
    const headers = { Cookie };
    this.socket = new WebSocket(this.baseUrl, undefined, { headers });
  }

  private async handleError() {
    this.connecting = false;
    if (this.attempts >= CONNECTION_ATTEMPT_COUNT)
      return this.emit('error', new HttpResponseError(503));
    await delay(CONNECTION_ATTEMPT_DELAY);
    this.createConnection();
  }

  private handleOpen() {
    this.connecting = false;
    this.attempts = CONNECTION_ATTEMPT_COUNT;
    this.setNextPingTimeout();
    this.emit('connection', {});
  }

  setNextPingTimeout() {
    clearTimeout(this.pingTimeout);
    this.pingTimeout = setTimeout(() => {
      this.socket.close();
      this.createConnection();
    }, PING_INTERVAL + 2000);
  }

  handleMessage(message: MessageEvent['data']) {
    if (message.toString() === 'ping') return this.setNextPingTimeout();
    const response = JSON.parse(message) as IWsResponse;
    const { requestId: reqId, data } = response;
    if (!reqId) return this.emit('message', data);
    // logData(response, 'RES');
    const handleResponse = this.requests.get(reqId);
    if (!handleResponse) return;
    this.requests.delete(reqId);
    handleResponse(response);
  }

  async sendRequest(
    pathname: string,
    data: Record<string, any> = {},
    // doLog = true,
  ): Promise<any> {
    await this.checkConnection();
    const requestId = this.genId();
    const request = { requestId, pathname, data };
    // doLog && logData(request, 'REQ');
    const message = JSON.stringify(request);
    const requestExecutor = this.createRequestExecutor(message);
    return new Promise(requestExecutor);
  }

  genId() {
    this.id = (this.id % 100) + 1;
    return this.id;
  }

  createRequestExecutor(message: string): TPromiseExecutor<void> {
    return (rv, rj) => {
      let timeout: NodeJS.Timeout | undefined = setTimeout(() => {
        this.requests.delete(this.id);
        timeout = undefined;
        rj(new HttpResponseError(503));
      }, CONNECTION_TIMEOUT);

      const handleResponse = (response: IWsResponse) => {
        if (!timeout) return;
        clearTimeout(timeout);
        const { data, status } = response;
        if (status === 200) return rv(data);
        rj(new HttpResponseError(status));
      };

      this.requests.set(this.id, handleResponse);
      this.socket.send(message);
    };
  }

}

export const getWsConnection = (
  baseUrl: string,
  onConnection: () => void,
  onMessage: (data: any) => void,
): [TFetch, () => void] => {
  const connection = new WsConnection(baseUrl);
  connection.on('connection', onConnection);
  connection.on('message', onMessage);
  return [connection.sendRequest, connection.closeConnection];
};
