import { join, resolve } from 'node:path';

export const BACK_PATH = './src/client';
export const FRONT_PATH = '../node-u-n-w-front/src/api';
export const BACK_STATIC_PATH = './public';
export const FRONT_STATIC_PATH = '../node-u-n-w-front/build';
export const FROM_BACK_TO_FRONT = [
  'common/api',
].map((i) => join(BACK_PATH, i));
export const FROM_FRONT_TO_BACK = [
  'common', 'common/app',
].map((i) => join(FRONT_PATH, i));
export const EXCLUDE_FROM_BACK = [
  'local'
].map((i) => join(BACK_PATH, i));
export const EXCLUDE_FROM_FRONT = [
  'local'
].map((i) => join(FRONT_PATH, i));
export const EXCLUDE_STATIC = [
  'assets/icons'
].map((i) => join(FRONT_STATIC_PATH, i));
export const FILES_TO_COPY_FROM_BACK_TO_FRONT: [string, string][] = [
  ['src/db/db.types.ts', 'local/db.types.ts'],
].map(([i, j]) => [resolve(i!), join(FRONT_PATH, j!)]);
