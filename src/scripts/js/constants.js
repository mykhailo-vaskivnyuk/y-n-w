const { join, resolve } = require('node:path');

exports.BUILD_PATH = 'js';
exports.backPath = './src/client';
exports.frontPath = '../node-u-n-w-front/src/app';
exports.backStaticPath = './public';
exports.frontStaticPath = '../node-u-n-w-front/build';
exports.fromBackToFront = [
  'common/server',
  'common/server/types',
].map((i) => join(exports.backPath, i));

exports.fromFrontToBack = [
  'common/client',
  'common/client/methods',
  'common/client/classes',
  'common/client/connection',
].map((i) => join(exports.frontPath, i));

exports.excludeFromBack = [
  'local',
].map((i) => join(exports.backPath, i));

exports.excludeFromFront = [
  'local',
].map((i) => join(exports.frontPath, i));

exports.excludeStatic = [
  'assets/icons',
].map((i) => join(exports.frontStaticPath, i));

exports.filesToCopyFromBackToFront = [
  ['src/db/types/db.tables.types.ts', 'local/db.tables.types.ts'],
  ['src/db/types/member.types.ts', 'local/member.types.ts'],
].map(([i, j]) => [resolve(i), join(exports.frontPath, j)]);
