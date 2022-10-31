"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientApi = exports.getCreateJs = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const _1 = require(".");
const validate_response_1 = require("../modules.response/validate.response");
const getTypeNameFromPathname = (pathname) => {
    const parts = pathname.replace('/', '').split('/');
    const name = parts.map((part) => part[0]?.toUpperCase() + part.slice(1)).join('');
    return 'T' + name.replace(/\./g, '_');
};
const getTypes = (params, indent = '') => {
    if (!params)
        return '';
    const result = [];
    if ((0, validate_response_1.isJoiSchema)(params)) {
        let type = params.type || '';
        type = type === 'object' ? 'Record<string, any>' : type;
        type = type === 'any' ? `${[...params._valids._values.values()][0]}` : type;
        return type;
    }
    if (Array.isArray(params)) {
        return params.map((item) => getTypes(item, indent)).join(' | ');
    }
    const paramsEntries = Object.entries(params);
    for (const [key, param] of paramsEntries) {
        result.push(`\n${indent}  ${key}: ${getTypes(param, indent)};`);
    }
    return `{${result.join('')}\n${indent}}`;
};
const getCreateJs = (config) => function createJs(routes, stream, typesStream, pathname = '', indent = '') {
    stream.write('{');
    const nextIndent = indent + '  ';
    const routesKeys = Object.keys(routes);
    for (const key of routesKeys) {
        stream.write(`\n${nextIndent}'${key}': `);
        const handler = routes[key];
        const nextPathname = pathname + '/' + key;
        if ((0, _1.isHandler)(handler)) {
            const types = getTypes(handler.params, nextIndent);
            const typeName = getTypeNameFromPathname(nextPathname);
            types && typesStream.write(`export type ${typeName} = ${types};\n`);
            const apiTypes = require(node_path_1.default.resolve(config.apiPath, 'types.js'));
            let [responseTypeName] = Object.entries(apiTypes).find(([, type]) => type === handler.responseSchema) || [];
            const typeNotFound = !responseTypeName;
            responseTypeName = responseTypeName && 'I' + responseTypeName.replace('Schema', '');
            const responseTypes = getTypes(handler.responseSchema, nextIndent);
            responseTypeName = responseTypeName || `${typeName}Response`;
            typeNotFound && responseTypes && typesStream.write(`export type ${responseTypeName} = ${responseTypes};\n`);
            typeNotFound && (responseTypeName = `Types.${responseTypeName}`);
            stream.write(`(${types ? `options: Types.${typeName}` : ''}) => fetch${responseTypes ? `<${responseTypeName}>` : ''}('${nextPathname}'${types ? ', options' : ''}),`);
        }
        else {
            createJs(handler, stream, typesStream, nextPathname, nextIndent);
            stream.write(',');
        }
    }
    stream.write('\n' + indent + '}');
};
exports.getCreateJs = getCreateJs;
const createClientApi = (config, routes) => {
    if (!routes)
        throw new Error('Routes is not put');
    const executor = (rv, rj) => {
        const apiPath = config.clientApiPath;
        const apiFileNameBase = node_path_1.default.basename(apiPath, node_path_1.default.extname(apiPath));
        const typesFileNameBase = apiFileNameBase + '.types';
        const typesFileName = typesFileNameBase + '.ts';
        const typesPath = node_path_1.default.join(node_path_1.default.dirname(apiPath), typesFileName);
        const stream = node_fs_1.default.createWriteStream(apiPath);
        const typesStream = node_fs_1.default.createWriteStream(typesPath);
        let isFinish = false;
        const handleFinish = () => isFinish ? rv() : isFinish = true;
        stream.on('error', (e) => (typesStream.close(), rj(e)));
        stream.on('finish', handleFinish);
        typesStream.on('error', (e) => (stream.close(), rj(e)));
        typesStream.on('finish', handleFinish);
        const apiTypesPath = node_path_1.default.resolve(config.apiPath, 'types.js');
        const apiTypes = require(apiTypesPath);
        Object.keys(apiTypes).forEach((typeName) => stream.write(`import { I${typeName.replace('Schema', '')} } from './types';\n`));
        stream.write(`import * as Types from './${typesFileNameBase}';

export const api = (
fetch: <T>(pathname: string, options?: Record<string, any>) => Promise<T>
) => (`);
        (0, exports.getCreateJs)(config)(routes, stream, typesStream);
        stream.write(');\n');
        stream.close();
        typesStream.close();
    };
    return new Promise(executor);
};
exports.createClientApi = createClientApi;
//# sourceMappingURL=create.client.api.js.map