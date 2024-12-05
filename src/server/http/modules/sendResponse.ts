import { Readable } from 'node:stream';
import { REQ_MIME_TYPES_ENUM } from '../constants';
import { TOperationResponse } from '../../../types/operation.types';
import { IResponse, THttpResModule } from '../types';

export const sendResponse: THttpResModule = () =>
  async function sendResponse(res: IResponse, body: TOperationResponse) {
    res.statusCode = 200;

    if (body instanceof Readable) {
      res.setHeader(
        'content-type',
        REQ_MIME_TYPES_ENUM['application/octet-stream'],
      );
      await new Promise((rv, rj) => {
        body.on('error', rj).on('end', rv).pipe(res);
      });
      return false;
    }

    res.setHeader('content-type', REQ_MIME_TYPES_ENUM['application/json']);
    res.end(body);
    return false;
  };
