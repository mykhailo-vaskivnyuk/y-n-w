import { Readable } from 'node:stream';
import { IOperation, IParams } from '../../../app/types';
import { ServerError } from '../../errors';
import { IHttpConfig, IRequest } from '../../types';
import {
  JSON_TRANSFORM_LENGTH, ReqMimeTypesKeys, REQ_MIME_TYPES_MAP,
} from '../constants';
import { IHttpContext, THttpReqModule } from '../types';
import { getJson, getUrlInstance } from '../utils';

let thisConfig: IHttpConfig;

export const getOperation: THttpReqModule = (
  config: IHttpConfig,
) => {
  thisConfig = config;
  return async (req, res, context) => {
    const {
      options, names, params, contextParams,
    } = getRequestParams(req, context);
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

    try {
      if (
        contentType === 'application/json' &&
        length < JSON_TRANSFORM_LENGTH
      ) {
        Object.assign(params, await getJson(req));
        return { options, names, data, contextParams };
      }
    } catch (e: any) {
      logger.error(e, e.message);
      throw new ServerError('BED_REQUEST');
    }

    const content = Readable.from(req);
    data.stream = { type: contentType, content };

    return { options, names, data, contextParams };
  };
};

const getRequestParams = (req: IRequest, context: IHttpContext) => {
  const { options, contextParams } = context;
  const { origin } = req.headers;
  const { pathname, searchParams } = getUrlInstance(req.url, origin);

  const names = (pathname
    .replace('/' + thisConfig?.paths.api, '')
    .slice(1) || 'index')
    .split('/')
    .filter((path) => Boolean(path));

  const params = {} as IParams;
  const queryParams = searchParams.entries();
  for (const [key, value] of queryParams) params[key] = value;

  options.origin = origin || '';

  return { options, names, params, contextParams };
};
