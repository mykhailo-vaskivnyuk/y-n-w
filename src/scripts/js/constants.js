
const path = require('node:path');

exports.backPath = './src/client';
exports.frontPath = '../node-y-n-w-front/src/api';
exports.fromBackToFront = [
  'common/api',
].map((i) => path.join(exports.backPath, i));
exports.fromFrontToBack = [
  'common', 'common/app',
].map((i) => path.join(exports.frontPath, i));
exports.excludeFromBack = [
  'local'
].map((i) => path.join(exports.backPath, i));
exports.excludeFromFront = [
  'local'
].map((i) => path.join(exports.frontPath, i));
exports.backStaticPath = './public';
exports.frontStaticPath = '../node-y-n-w-front/build';
exports.excludeStatic = [
  'assets/icons'
].map((i) => path.join(exports.frontStaticPath, i));
exports.buildPath = 'js';
