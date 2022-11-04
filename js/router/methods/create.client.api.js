"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJs = exports.createClientApi = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const utils_1 = require("../utils");
const validate_response_1 = require("../modules.response/validate.response");
const tpl = __importStar(require("./templates"));
const createClientApi = (config, routes) => {
    const executor = (rv, rj) => {
        const apiPath = config.clientApiPath;
        const apiExt = node_path_1.default.extname(apiPath);
        const apiDir = node_path_1.default.dirname(apiPath);
        const apiFileNameBase = node_path_1.default.basename(apiPath, apiExt);
        const typesFileNameBase = apiFileNameBase + '.types';
        const typesFileName = typesFileNameBase + '.ts';
        const typesPath = node_path_1.default.join(apiDir, typesFileName);
        const apiStream = node_fs_1.default.createWriteStream(apiPath);
        const typesStream = node_fs_1.default.createWriteStream(typesPath);
        let isFinish = false;
        const handleFinish = () => isFinish ? rv() : isFinish = true;
        const handleError = (e) => {
            apiStream.close();
            typesStream.close();
            rj(e);
        };
        apiStream.on('error', handleError);
        apiStream.on('finish', handleFinish);
        typesStream.on('error', handleError);
        typesStream.on('finish', handleFinish);
        const apiTypesPath = node_path_1.default.resolve(config.apiPath, 'types.js');
        const apiTypes = require(apiTypesPath);
        Object
            .keys(apiTypes)
            .map((schemaName) => 'I' + schemaName.replace('Schema', ''))
            .forEach((typeName) => apiStream.write(tpl.strImport(typeName)));
        apiStream.write(tpl.strGetApi(typesFileNameBase));
        (0, exports.createJs)(apiTypes, apiStream, typesStream)(routes);
        apiStream.write(');\n');
        apiStream.close();
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
        apiStream.write(tpl.strKey(nextIndent, key));
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
        paramsTypes && typesStream.write(tpl.strExport(paramsTypeNameExport, paramsTypes));
        const responseSchema = handler.responseSchema;
        const predefinedResponseSchema = Object.keys(apiTypes)
            .find((key) => apiTypes[key] === responseSchema);
        if (predefinedResponseSchema) {
            const responseTypeName = 'I' + predefinedResponseSchema.replace('Schema', '');
            apiStream.write(tpl.strMethod(paramsTypeName, responseTypeName, nextPathname));
            continue;
        }
        const responseTypes = getTypes(responseSchema, nextIndent);
        if (!responseTypes)
            throw new Error(`Handler ${nextPathname} dosn't have response schema`);
        typesStream.write(tpl.strExport(responseTypeNameExport, responseTypes));
        const responseTypeName = 'Types.' + responseTypeNameExport;
        apiStream.write(tpl.strMethod(paramsTypeName, responseTypeName, nextPathname));
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
        return '';
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
    const types = schemaEntries
        .map(([key, item]) => tpl.strTypes(indent, key, getTypes(item, indent)));
    return '{' + types.join('') + '\n' + indent + '}';
};
const getSchemaType = (schema) => {
    const schemaValuesSet = schema._valids._values;
    const [type] = [...schemaValuesSet.values()];
    return `${type}`;
};
//# sourceMappingURL=create.client.api.js.map