"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStreamError = void 0;
const constants_1 = require("../../server/http/constants");
class GetStreamError extends Error {
    constructor(message) {
        super(message || 'Validation error');
        this.name = this.constructor.name;
    }
}
exports.GetStreamError = GetStreamError;
const getStream = () => async (operation, context) => {
    const { params, stream } = operation.data;
    if (!stream)
        return [operation, context];
    const { type, content } = stream;
    if (type === constants_1.REQ_MIME_TYPES_ENUM['application/octet-stream']) {
        params.stream = stream;
        delete operation.data.stream;
        return [operation, context];
    }
    try {
        const buffers = [];
        for await (const chunk of content)
            buffers.push(chunk);
        const string = Buffer.concat(buffers).toString() || '{}';
        Object.assign(params, JSON.parse(string));
        return [operation, context];
    }
    catch (e) {
        logger.error(e, e.message);
        throw new GetStreamError(e.message);
    }
};
exports.default = getStream;
//# sourceMappingURL=get.stream.js.map