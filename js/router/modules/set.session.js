"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSession = exports.SessionError = void 0;
const session_1 = require("../../services/session/session");
class SessionError extends Error {
    constructor() {
        super('Session error');
        this.name = this.constructor.name;
    }
}
exports.SessionError = SessionError;
const setSession = () => async (context, data) => {
    const { params } = data;
    const { sessionKey } = params;
    if (!sessionKey)
        return [context, data];
    try {
        const session = await (0, session_1.createSession)(sessionKey);
        context.session = session;
        return [context, data];
    }
    catch (e) {
        logger.error(e);
        throw new SessionError();
    }
};
exports.setSession = setSession;
//# sourceMappingURL=set.session.js.map