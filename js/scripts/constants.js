"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromFrontToBack = exports.fromBackToFront = exports.frontPath = exports.backPath = void 0;
const node_path_1 = __importDefault(require("node:path"));
exports.backPath = './src/client';
exports.frontPath = '../node-y-n-w-front/src/api';
exports.fromBackToFront = [
    'common/api',
].map((i) => node_path_1.default.join(exports.backPath, i));
exports.fromFrontToBack = [
    'common', 'common/app',
].map((i) => node_path_1.default.join(exports.frontPath, i));
//# sourceMappingURL=constants.js.map