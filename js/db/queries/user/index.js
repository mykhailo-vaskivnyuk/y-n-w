"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsetLink = exports.setLink = exports.createUser = exports.findByLink = exports.findUserByEmail = exports.getUserById = void 0;
exports.getUserById = 'SELECT * FROM users WHERE user_id=$1';
exports.findUserByEmail = 'SELECT * FROM users WHERE email=$1';
exports.findByLink = 'SELECT * FROM users WHERE link=$1 OR restore=$1';
exports.createUser = 'INSERT INTO users (email, password, link) VALUES($1, $2, $3)';
exports.setLink = 'UPDATE users SET link=$2, restore=$3 WHERE user_id=$1';
exports.unsetLink = 'UPDATE users SET link=NULL, restore=NULL WHERE user_id=$1';
//# sourceMappingURL=index.js.map