"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJs = exports.createClientApi = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const utils_1 = require("../utils");
const validate_response_1 = require("../modules.response/validate.response");
const templates_1 = require("./templates");
const createClientApi = (config, routes) => {
    if (!routes)
        throw new Error('Routes is not set');
    const executor = (rv, rj) => {
        const apiPath = config.clientApiPath;
        const apiFileNameBase = node_path_1.default.basename(apiPath, node_path_1.default.extname(apiPath));
        const typesFileNameBase = apiFileNameBase + '.types';
        const typesFileName = typesFileNameBase + '.ts';
        const typesPath = node_path_1.default.join(node_path_1.default.dirname(apiPath), typesFileName);
        const apistream = node_fs_1.default.createWriteStream(apiPath);
        const typesStream = node_fs_1.default.createWriteStream(typesPath);
        let isFinish = false;
        const handleFinish = () => isFinish ? rv() : isFinish = true;
        const handleError = (e) => {
            apistream.close();
            typesStream.close();
            rj(e);
        };
        apistream.on('error', handleError);
        apistream.on('finish', handleFinish);
        typesStream.on('error', handleError);
        typesStream.on('finish', handleFinish);
        const apiTypesPath = node_path_1.default.resolve(config.apiPath, 'types.js');
        const apiTypes = require(apiTypesPath);
        Object
            .keys(apiTypes)
            .map((schemaName) => 'I' + schemaName.replace('Schema', ''))
            .forEach((typeName) => apistream.write((0, templates_1.getImport)(typeName)));
        apistream.write((0, templates_1.getApi)(typesFileNameBase));
        (0, exports.createJs)(apiTypes, apistream, typesStream)(routes);
        apistream.write(');\n');
        apistream.close();
        typesStream.close();
    };
    return new Promise(executor);
};
exports.createClientApi = createClientApi;
const createJs = (apiTypes, apiStream, typesStream) => function createJs(routes, pathname = '', indent = '') {
    apiStream.write('{');
    const nextIndent = indent + '  ';
    const routesKeys = Object.keys(routes);
    for (const key of routesKeys) {
        apiStream.write(`\n${nextIndent}'${key}': `);
        const handler = routes[key];
        const nextPathname = pathname + '/' + key;
        if (!(0, utils_1.isHandler)(handler)) {
            createJs(handler, nextPathname, nextIndent);
            apiStream.write(',');
            continue;
        }
        const typeName = getTypeNameFromPathname(nextPathname);
        const paramsTypeNameExport = typeName;
        const responseTypeNameExport = typeName + 'Response';
        const paramsTypes = getTypes(handler.paramsSchema, nextIndent);
        const paramsTypeName = paramsTypes && 'Types.' + paramsTypeNameExport;
        paramsTypes && typesStream.write((0, templates_1.getExport)(paramsTypeNameExport, paramsTypes));
        const responseSchema = handler.responseSchema;
        const predefinedResponseSchema = Object.keys(apiTypes)
            .find((key) => apiTypes[key] === responseSchema);
        if (predefinedResponseSchema) {
            const responseTypeName = 'I' + predefinedResponseSchema.replace('Schema', '');
            apiStream.write((0, templates_1.getMethod)(paramsTypeName, responseTypeName, nextPathname));
            continue;
        }
        const responseTypes = getTypes(responseSchema, nextIndent);
        if (!responseTypes)
            throw new Error(`Handler ${nextPathname} dosn't have response schema`);
        typesStream.write((0, templates_1.getExport)(responseTypeNameExport, responseTypes));
        const responseTypeName = 'Types.' + responseTypeNameExport;
        apiStream.write((0, templates_1.getMethod)(paramsTypeName, responseTypeName, nextPathname));
    }
    apiStream.write('\n' + indent + '}');
};
exports.createJs = createJs;
const getTypeNameFromPathname = (pathname) => {
    return 'T' + pathname
        .replace('/', '')
        .replace(/\./g, '_')
        .split('/')
        .map((part) => part[0]?.toUpperCase() + part.slice(1))
        .join('');
};
const getTypes = (schema, indent = '') => {
    if (!schema)
        return;
    if ((0, validate_response_1.isJoiSchema)(schema)) {
        let type = schema.type || '';
        if (type === 'object')
            type = 'Record<string, any>';
        else if (type === 'any')
            type = getSchemaType(schema);
        return type;
    }
    if (Array.isArray(schema)) {
        return schema
            .map((item) => getTypes(item, indent))
            .join(' | ');
    }
    const schemaEntries = Object.entries(schema);
    const result = schemaEntries.map(([key, item]) => `\n${indent}  ${key}: ${getTypes(item, indent)};`);
    return '{' + result.join('') + '\n' + indent + '}';
};
const getSchemaType = (schema) => {
    const schemaValuesSet = schema._valids._values;
    const [type] = [...schemaValuesSet.values()];
    return `${type}`;
};
//# sourceMappingURL=create.client.api.js.map