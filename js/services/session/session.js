"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = exports.Session = void 0;
class Session {
    sessionKey;
    session = null;
    constructor(sessionKey) {
        this.sessionKey = sessionKey;
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
        if (this.session)
            return this.session[key];
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
        const result = await execQuery.session.read([this.sessionKey]);
        if (!result?.[0])
            return this;
        const { session_value } = result[0];
        this.deserialize(session_value);
        return this;
    }
    serialize() {
        return JSON.stringify(this.session);
    }
    deserialize(value) {
        this.session = JSON.parse(value);
    }
}
exports.Session = Session;
const createSession = async (sessionKey) => {
    return await new Session(sessionKey).init();
};
exports.createSession = createSession;
//# sourceMappingURL=session.js.map