"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionError = void 0;
const session_1 = require("../../services/session/session");
class SessionError extends Error {
    constructor() {
        super('Session error');
        this.name = this.constructor.name;
    }
}
exports.SessionError = SessionError;
const createSession = (0, session_1.createService)();
const setSession = () => async (context, operation) => {
    const { options } = operation;
    const { sessionKey } = options;
    if (!sessionKey)
        return [context, operation];
    try {
        const session = await createSession(sessionKey);
        context.session = session;
        return [context, operation];
    }
    catch (e) {
        logger.error(e);
        throw new SessionError();
    }
};
exports.default = setSession;
//# sourceMappingURL=set.session.js.map