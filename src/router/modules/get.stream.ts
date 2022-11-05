import { REQ_MIME_TYPES_ENUM } from '../../server/http/constants';
import { TModule } from '../types';

export class GetStreamError extends Error {
  constructor(message?: string) {
    super(message || 'Validation error');
    this.name = this.constructor.name;
  }
}

const getStream: TModule = () => async (operation, context) => {
  const { params, stream } = operation.data;
  if (!stream) return [operation, context];
  const { type,  content } = stream;

  if (type === REQ_MIME_TYPES_ENUM['application/octet-stream']) {
    params.stream = stream;
    delete operation.data.stream;
    return [operation, context];
  }

  try {
    const buffers: Uint8Array[] = [];
    for await (const chunk of content) buffers.push(chunk as any);
    const string = Buffer.concat(buffers).toString() || '{}';
    Object.assign(params, JSON.parse(string));
    return [operation, context];
  } catch (e: any) {
    logger.error(e, e.message);
    throw new GetStreamError(e.message);
  }
};

export default getStream;
