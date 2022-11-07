import http from 'node:http';

export type IRequest = http.IncomingMessage;
export type IResponse = http.ServerResponse;
export type IServer = http.Server;
export type IHeaders = http.OutgoingHttpHeaders;
