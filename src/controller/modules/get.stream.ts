/* eslint-disable indent */
import { TInputModule } from '../types';
import { Buffer } from 'node:buffer';

export class GetStreamError extends Error {
  constructor(message?: string) {
    super(message || 'Validation error');
    this.name = this.constructor.name;
  }
}

const getStream: TInputModule =
  () =>
  async ({ ...operation }) => {
    const { params, stream } = operation.data;
    if (!stream) return operation;
    const { type, content } = stream;

    if (type === 'application/octet-stream') {
      params.stream = stream;
      delete operation.data.stream;
      return operation;
    }

    try {
      const buffers: Uint8Array[] = [];
      for await (const chunk of content) buffers.push(chunk as any);
      const string = Buffer.concat(buffers).toString() || '{}';
      Object.assign(params, JSON.parse(string));
      return operation;
    } catch (e: any) {
      logger.error(e);
      throw new GetStreamError(e.message);
    }
  };

export default getStream;
