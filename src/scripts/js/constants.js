const { join, resolve } = require('node:path');

exports.BUILD_PATH = 'js';
exports.backPath = './src/client';
exports.frontPath = '../node-u-n-w-front/src/app';
exports.backStaticPath = './public';
exports.frontStaticPath = '../node-u-n-w-front/build';
exports.fromBackToFront = [
  'common',
  'common/server',
  'common/server/types',
].map((i) => join(exports.backPath, i));

exports.fromFrontToBack = [
  'common/client',
  'common/client/lib',
  'common/client/methods',
  'common/client/classes',
  'common/client/connection',
].map((i) => join(exports.frontPath, i));

exports.excludeFromBack = ['local'].map((i) => join(exports.backPath, i));

exports.excludeFromFront = ['local'].map((i) => join(exports.frontPath, i));

exports.excludeStatic = ['assets/icons'].map((i) =>
  join(exports.frontStaticPath, i),
);

exports.filesToCopyFromBackToFront = [
  ['src/domain/types/db.types.ts', 'local/db.types.ts'],
  ['src/domain/types/member.types.ts', 'local/member.types.ts'],
  ['src/domain/types/net.types.ts', 'local/net.types.ts'],
].map(([i, j]) => [resolve(i), join(exports.frontPath, j)]);
