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
const { createSession } = (0, session_1.getService)();
const setSession = () => async (operation, context) => {
    const { options } = operation;
    const { sessionKey } = options;
    if (!sessionKey)
        return [operation, context];
    try {
        const session = await createSession(sessionKey);
        context.session = session;
        return [operation, context];
    }
    catch (e) {
        logger.error(e, e.message);
        throw new SessionError();
    }
};
exports.default = setSession;
//# sourceMappingURL=set.session.js.map