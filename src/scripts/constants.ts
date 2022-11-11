import { join, resolve } from 'node:path';

export const backPath = './src/client';
export const frontPath = '../node-y-n-w-front/src/api';
export const fromBackToFront = [
  'common/api',
].map((i) => join(backPath, i));
export const fromFrontToBack = [
  'common', 'common/app',
].map((i) => join(frontPath, i));
export const excludeFromBack = [
  'local'
].map((i) => join(backPath, i));
export const excludeFromFront = [
  'local'
].map((i) => join(frontPath, i));

export const backStaticPath = './public';
export const frontStaticPath = '../node-y-n-w-front/build';
export const excludeStatic = [
  'assets/icons'
].map((i) => join(frontStaticPath, i));

export const buildPath = 'js';

export const filesToCopyFromBackToFront: [string, string][] = [
  ['src/db/db.types.ts', 'local/db.types.ts'],
].map(([i, j]) => [resolve(i!), join(frontPath, j!)]);
