import { Readable } from 'node:stream';
import {
  JSON_TRANSFORM_LENGTH,
  ReqMimeTypesKeys,
  REQ_MIME_TYPES_MAP,
} from '../constants';
import { IOperation, IParams } from '../../../types/operation.types';
import { IRequest } from '../../types';
import { IHttpConfig, IHttpContext, THttpReqModule } from '../types';
import { ServerError } from '../../errors';

import { getJson, getUrlInstance } from '../methods/utils';
import { pathToArray } from '../../../utils/utils';

let thisConfig: IHttpConfig;

export const getOperation: THttpReqModule = (config: IHttpConfig) => {
  thisConfig = config;
  return async (req, res, context) => {
    const { options, names, params, contextParams } = getRequestParams(
      req,
      context,
    );
    const data = { params } as IOperation['data'];
    const { headers } = req;
    const contentType = headers['content-type'] as ReqMimeTypesKeys | undefined;
    const length = +(headers['content-length'] || Infinity);

    if (!contentType) return { options, names, data, contextParams };

    if (!REQ_MIME_TYPES_MAP[contentType]) {
      throw new ServerError('BED_REQUEST');
    }
    if (length > REQ_MIME_TYPES_MAP[contentType].maxLength) {
      throw new ServerError('BED_REQUEST');
    }

    const isNotJson =
      contentType !== 'application/json' || length > JSON_TRANSFORM_LENGTH;

    if (isNotJson) {
      const content = Readable.from(req);
      data.stream = { type: contentType, content };
      return { options, names, data, contextParams };
    }

    try {
      Object.assign(params, await getJson(req));
      return { options, names, data, contextParams };
    } catch (e: any) {
      logger.error(e);
      throw new ServerError('BED_REQUEST');
    }
  };
};

const getRequestParams = (req: IRequest, context: IHttpContext) => {
  const { headers, url } = req;
  const { origin = '', host } = headers;
  const { pathname, searchParams } = getUrlInstance(url, host);
  const { options, contextParams } = context;
  const { apiPathname } = thisConfig;
  const strNames = pathname.replace(`/${apiPathname}/`, '');
  const names = pathToArray(strNames || 'index');
  const params: IParams = Object.fromEntries(searchParams);
  options.origin = origin;

  return { names, params, options, contextParams };
};
