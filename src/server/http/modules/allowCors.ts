import { HEADERS } from '../constants';
import { THttpReqModule } from '../types';

export const allowCors: THttpReqModule = () =>
  async function allowCors(req, res, { ...context }) {
    const { origin } = req.headers;
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    const { method } = req;
    if (method?.toLocaleLowerCase() === 'options') {
      res.writeHead(200, HEADERS);
      res.end();
      return null;
    }
    Object.keys(HEADERS).forEach((key) =>
      res.setHeader(key, HEADERS[key as keyof typeof HEADERS]),
    );
    return context;
  };
