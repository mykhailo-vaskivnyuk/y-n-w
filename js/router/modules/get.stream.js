"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStreamError = void 0;
const constants_1 = require("../../constants/constants");
class GetStreamError extends Error {
    constructor(message) {
        super(message || 'Validation error');
        this.name = this.constructor.name;
    }
}
exports.GetStreamError = GetStreamError;
const getStream = () => async (context, operation) => {
    const { params, stream } = operation.data;
    if (!stream)
        return [context, operation];
    const { type, content } = stream;
    if (type === constants_1.MIME_TYPES_ENUM['application/octet-stream']) {
        params.stream = stream;
        delete operation.data.stream;
        return [context, operation];
    }
    try {
        const buffers = [];
        for await (const chunk of content)
            buffers.push(chunk);
        const string = Buffer.concat(buffers).toString() || '{}';
        Object.assign(params, JSON.parse(string));
        return [context, operation];
    }
    catch (e) {
        logger.error(e);
        throw new GetStreamError(e.message);
    }
};
exports.default = getStream;
//# sourceMappingURL=get.stream.js.map