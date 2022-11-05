import path from 'node:path';

export const backPath = './src/client';
export const frontPath = '../node-y-n-w-front/src/api';
export const fromBackToFront = [
  'common/api',
].map((i) => path.join(backPath, i));
export const fromFrontToBack = [
  'common', 'common/app',
].map((i) => path.join(frontPath, i));
