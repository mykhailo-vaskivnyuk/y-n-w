"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = exports.update = exports.create = exports.read = void 0;
exports.read = 'SELECT session_value FROM sessions WHERE session_key = $1';
exports.create = 'INSERT INTO sessions (session_key, session_value) VALUES ($1, $2)';
exports.update = 'UPDATE sessions SET session_value = $2 WHERE session_key = $1';
exports.del = 'DELETE FROM sessions WHERE session_key = $1';
//# sourceMappingURL=session.js.map