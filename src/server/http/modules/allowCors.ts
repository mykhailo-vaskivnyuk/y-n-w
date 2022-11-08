import { HEADERS } from '../constants';
import { THttpModule } from '../types';

export const allowCors: THttpModule = () =>
  async function allowCors(req, res, { ...options }) {
    const { method } = req;
    if (method?.toLocaleLowerCase() === 'options') {
      res.writeHead(200, HEADERS);
      res.end();
      return null;
    }
    Object
      .keys(HEADERS)
      .forEach((key) =>
        res.setHeader(key, HEADERS[key as keyof typeof HEADERS])
      );
    return options;
  };
