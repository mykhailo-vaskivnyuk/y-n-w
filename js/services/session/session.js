"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createService = exports.Session = void 0;
class Session {
    sessionKey;
    session = null;
    finalCallback;
    constructor(sessionKey, finalCallback) {
        this.sessionKey = sessionKey;
        this.finalCallback = finalCallback;
    }
    async write(key, value) {
        let isUpdate = true;
        if (!this.session) {
            this.session = {};
            isUpdate = false;
        }
        this.session[key] = value;
        const sessionValue = this.serialize();
        if (isUpdate)
            await execQuery.session.update([this.sessionKey, sessionValue]);
        else
            await execQuery.session.create([this.sessionKey, sessionValue]);
        return value;
    }
    read(key) {
        return this.session?.[key];
    }
    async delete(key) {
        if (!this.session)
            return;
        const value = this.session[key];
        if (!value)
            return;
        delete this.session[key];
        if (Object.keys(this.session).length) {
            const sessionValue = this.serialize();
            await execQuery.session.update([this.sessionKey, sessionValue]);
        }
        else
            await this.clear();
        return value;
    }
    async clear() {
        if (!this.session)
            return;
        this.session = null;
        await execQuery.session.del([this.sessionKey]);
    }
    async init() {
        const [result] = await execQuery.session.read([this.sessionKey]);
        this.deserialize(result?.session_value);
        return this;
    }
    finalize() {
        this.finalCallback();
    }
    serialize() {
        return JSON.stringify(this.session);
    }
    deserialize(value) {
        this.session = value ? JSON.parse(value) : null;
    }
}
exports.Session = Session;
const createService = () => {
    const activeSessions = new Map();
    const clearSession = (sessionKey) => {
        const [session, count = 0] = activeSessions.get(sessionKey) || [];
        if (!session)
            return;
        if (count <= 1)
            activeSessions.delete(sessionKey);
        else
            activeSessions.set(sessionKey, [session, count - 1]);
    };
    const createSession = async (sessionKey) => {
        let [session, count = 0] = activeSessions.get(sessionKey) || [];
        if (!session)
            session = new Session(sessionKey, () => clearSession(sessionKey)).init();
        activeSessions.set(sessionKey, [session, ++count]);
        const s = (await activeSessions.get(sessionKey))[0];
        return s;
    };
    return createSession;
};
exports.createService = createService;
//# sourceMappingURL=session.js.map