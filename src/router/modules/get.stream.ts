import { MIME_TYPES_ENUM } from '../../constants/constants';
import { TModule } from '../types';

export class GetStreamError extends Error {
  constructor(message?: string) {
    super(message || 'Validation error');
    this.name = this.constructor.name;
  }
}

export const getStream: TModule = () => async (context, operation) => {
  const { params, stream } = operation.data;
  if (!stream) return [context, operation];
  const { type,  content } = stream;
  
  if (type === MIME_TYPES_ENUM['application/octet-stream']) {
    params.stream = stream;
    delete operation.data.stream;
    return [context, operation];
  }
  
  try {
    const buffers: Uint8Array[] = [];
    for await (const chunk of content) buffers.push(chunk as any);
    const string = Buffer.concat(buffers).toString() || '{}';
    Object.assign(params, JSON.parse(string));
    return [context, operation];
  } catch (e: any) {
    logger.error(e);
    throw new GetStreamError(e.message);
  }
}
