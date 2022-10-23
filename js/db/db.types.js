"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TABLES_ENUM = exports.TABLES_MAP = void 0;
const utils_1 = require("../utils/utils");
exports.TABLES_MAP = {
    SESSIONS: 'sessions',
    USERS: 'users',
    USERS_NOTIFICATIONS: 'users_notifications',
    MEMBERS_USERS: 'members_users',
    NETS: 'nets',
    NETS_DATA: 'nets_data',
    NETS_EVENTS: 'nets_events',
    NETS_USERS_DATA: 'nets_users_data',
    NODES: 'nodes',
    NODES_TMP: 'nodes_tmp',
    NODES_USERS: 'nodes_users',
    NOTIFICATIONS_TPL: 'notifications_tpl',
};
exports.TABLES_ENUM = (0, utils_1.getEnumFromMap)(exports.TABLES_MAP);
//# sourceMappingURL=db.types.js.map