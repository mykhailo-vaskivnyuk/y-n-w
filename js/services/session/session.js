"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getService = exports.Session = void 0;
class Session {
    sessionKey;
    finalCallback;
    session = null;
    isPersisted = false;
    constructor(sessionKey, finalCallback) {
        this.sessionKey = sessionKey;
        this.finalCallback = finalCallback;
    }
    async init() {
        const [persisted] = await execQuery.session.read([this.sessionKey]);
        this.isPersisted = Boolean(persisted);
        this.deserialize(persisted?.session_value);
        return this;
    }
    read(key) {
        return this.session?.[key];
    }
    write(key, value) {
        !this.session && (this.session = {});
        return this.session[key] = value;
    }
    delete(key) {
        if (!this.session)
            return;
        const value = this.session[key];
        delete this.session[key];
        const length = Object.keys(this.session).length;
        if (!length)
            this.clear();
        return value;
    }
    clear() {
        this.session = null;
    }
    async finalize() {
        await this.finalCallback(this.sessionKey);
    }
    serialize() {
        return JSON.stringify(this.session);
    }
    deserialize(value) {
        this.session = JSON.parse(value || 'null');
    }
    async persist() {
        if (this.session) {
            const sessionValue = this.serialize();
            if (this.isPersisted)
                await execQuery.session.update([this.sessionKey, sessionValue]);
            else
                await execQuery.session.create([this.sessionKey, sessionValue]);
            return;
        }
        if (!this.isPersisted)
            return;
        await execQuery.session.del([this.sessionKey]);
    }
}
exports.Session = Session;
const getService = () => {
    const activeSessions = new Map();
    const clearSession = async (sessionKey) => {
        const [sessionPromise, count = 0] = activeSessions.get(sessionKey) || [];
        if (!sessionPromise)
            return;
        if (count > 1)
            activeSessions.set(sessionKey, [sessionPromise, count - 1]);
        else {
            activeSessions.delete(sessionKey);
            await sessionPromise.then((session) => session.persist());
        }
    };
    const createSession = async (sessionKey) => {
        let [session, count = 0] = activeSessions.get(sessionKey) || [];
        if (!session)
            session = new Session(sessionKey, clearSession).init();
        activeSessions.set(sessionKey, [session, ++count]);
        return session;
    };
    return { createSession };
};
exports.getService = getService;
//# sourceMappingURL=session.js.map