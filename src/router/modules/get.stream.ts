import { MIME_TYPES_ENUM } from '../../constants';
import { TModule } from '../types';

export class GetStreamError extends Error {
  constructor(message?: string) {
    super(message || 'Validation error');
    this.name = this.constructor.name;
  }
}

export const getStream: TModule = async (context, data) => {
  const { params, stream } = data;
  if (!stream) return [context, data];
  const { type,  content } = stream;
  
  if (type === MIME_TYPES_ENUM['application/octet-stream']) {
    params.stream = stream;
    delete data.stream;
    return [context, data];
  }
  
  try {
    const buffers: Uint8Array[] = [];
    for await (const chunk of content) buffers.push(chunk as any);
    const string = Buffer.concat(buffers).toString() || '{}';
    Object.assign(params, JSON.parse(string));
    return [context, data];
  } catch (e: any) {
    logger.error(e);
    throw new GetStreamError(e.message);
  }
}
