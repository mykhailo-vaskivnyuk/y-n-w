const { join, resolve } = require('node:path');

exports.BUILD_PATH = 'js';
exports.backPath = './src/client';
exports.frontPath = '../node-u-n-w-front/src/api';
exports.backStaticPath = './public';
exports.frontStaticPath = '../node-u-n-w-front/build';
exports.fromBackToFront = [
  'common/api', 'common/api/types',
].map((i) => join(exports.backPath, i));
exports.fromFrontToBack = [
  'common', 'common/app', 'common/app/methods',
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
  ['src/db/db.types.ts', 'local/db.types.ts'],
].map(([i, j]) => [resolve(i), join(exports.frontPath, j)]);
