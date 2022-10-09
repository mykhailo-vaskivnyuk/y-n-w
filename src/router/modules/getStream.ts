import { MIME_TYPES_ENUM } from '../../constants';
import { TModule } from '../types';
import { RouterError, RouterErrorEnum } from '../errors';

const getStream: TModule = async (data) => {
  const { params, stream } = data;
  if (!stream) return data;
  const { type,  content } = stream;
  
  if (type === MIME_TYPES_ENUM['application/octet-stream']) {
    Object.assign(params, { stream });
    return data;
  }
  
  try {
    const buffers: Uint8Array[] = [];
    for await (const chunk of content) buffers.push(chunk as any);
    const string = Buffer.concat(buffers).toString() || '{}';
    Object.assign(params, JSON.parse(string));
    return data;
  } catch (e: any) {
    logger.error(e);
    throw new RouterError(RouterErrorEnum.E_STREAM);
  }
}

export = getStream;
