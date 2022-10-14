import { getEnumFromMap } from './utils/utils'

export const MIME_TYPES_MAP = {
  'application/json': { maxLength: 1_000 },
  'application/octet-stream': { maxLength: 1_000_000 },
}

export const MIME_TYPES_ENUM = getEnumFromMap(MIME_TYPES_MAP);

export const JSON_TRANSFORM_LENGTH = 100;
