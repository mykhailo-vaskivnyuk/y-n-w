/* eslint-disable max-lines */
import { IWsResponse, TFetch } from './types';
import { TPromiseExecutor } from '../local/imports';
import {
  CONNECTION_ATTEMPT_COUNT, CONNECTION_ATTEMPT_DELAY,
  CONNECTION_TIMEOUT, PING_INTERVAL,
} from './constants';
import { HttpResponseError } from './errors';
import { EventEmitter } from './event.emitter';
import { logData, delay } from './utils';

class WsConnection extends EventEmitter {
  private socket: WebSocket;
  private pingTimeout: NodeJS.Timeout;
  private connecting = false;
  private attempts = 0;
  private id = 0;
  private requests: Map<number, (response: IWsResponse) => void>;

  constructor(private baseUrl: string) {
    super();
    this.handleOpen = this.handleOpen.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
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

  async createConnection() {
    if (this.connecting) return;
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
    this.socket.addEventListener('message', this.handleMessage);
  }

  createSocket() {
    clearTimeout(this.pingTimeout);
    this.requests = new Map();
    this.socket = new WebSocket(this.baseUrl);
  }

  private async handleError() {
    this.connecting = false;
    if (this.attempts >= CONNECTION_ATTEMPT_COUNT)
      return this.emit('error', new HttpResponseError(503));
    await delay(CONNECTION_ATTEMPT_DELAY);
    this.createConnection();
  };

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

  handleMessage({ data: message }: MessageEvent) {
    if (message === 'ping') return this.setNextPingTimeout();
    const response = JSON.parse(message) as IWsResponse;
    const { requestId: reqId, data } = response;
    if (!reqId) return this.emit('message', data);
    logData(response, 'RES');
    const handleResponse = this.requests.get(reqId);
    if (!handleResponse) return;
    this.requests.delete(reqId);
    handleResponse(response);
  }

  async sendRequest(
    pathname: string,
    data: Record<string, any> = {},
    doLog = true,
  ): Promise<any> {
    await this.checkConnection();
    const requestId = this.genId();
    const request = { requestId, pathname, data };
    doLog && logData(request, 'REQ');
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
      let timeout: NodeJS.Timeout;

      const handleResponse = (response: IWsResponse) => {
        clearTimeout(timeout);
        const { data, status } = response;
        if (status === 200) return rv(data);
        rj(new HttpResponseError(status));
      };
      this.requests.set(this.id, handleResponse);

      timeout = setTimeout(() => {
        this.requests.delete(this.id);
        rj(new HttpResponseError(503));
      }, CONNECTION_TIMEOUT);

      this.socket.send(message);
    };
  }

}

export const getConnection = (
  baseUrl: string,
  onConnection: () => void,
  onMessage: (data: any) => void,
): TFetch => {
  const connection = new WsConnection(baseUrl);
  connection.on('connection', onConnection)
  connection.on('message', onMessage)
  return connection.sendRequest;
};
