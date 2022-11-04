"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../../db/errors");
const errors_2 = require("../errors");
const validate_response_1 = require("../modules.response/validate.response");
const get_stream_1 = require("../modules/get.stream");
const set_session_1 = require("../modules/set.session");
const validate_1 = require("../modules/validate");
const errorHandler = (e) => {
    const { message, code, details } = e;
    if (e.name === errors_1.DatabaseError.name) {
        throw new errors_2.RouterError('E_HANDLER', message);
    }
    if (e instanceof errors_2.HandlerError) {
        if (code === 'E_REDIRECT') {
            throw new errors_2.RouterError('E_REDIRECT', details);
        }
        throw new errors_2.RouterError('E_HANDLER', message);
    }
    if (e instanceof set_session_1.SessionError)
        throw new errors_2.RouterError('E_ROUTER', message);
    if (e instanceof validate_1.ValidationError)
        throw new errors_2.RouterError('E_MODULE', details);
    if (e instanceof get_stream_1.GetStreamError)
        throw new errors_2.RouterError('E_MODULE', message);
    if (e instanceof validate_response_1.ValidationResponseError)
        throw new errors_2.RouterError('E_MODULE', message);
    logger.error(e, e.message);
    throw new errors_2.RouterError('E_ROUTER', details || message);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.handler.js.map