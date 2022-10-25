-- --------------------------------------------------------

-- Структура таблицi "members_users"

--

DROP TABLE IF EXISTS "members_users";

CREATE TABLE "members_users" (
  "net_id" int DEFAULT NULL,
  "member_id" int DEFAULT NULL,
  "user_id" int DEFAULT NULL,
  "list_name" varchar(50) DEFAULT NULL,
  "note" varchar(255) DEFAULT NULL,
  "dislike" bit(1) DEFAULT b'0',
  "voice" bit(1) DEFAULT b'0'
);

CREATE UNIQUE INDEX akMembersUsers ON "members_users" ("net_id","user_id","member_id");

-- --------------------------------------------------------

--
-- Структура таблицi "nets"
--

DROP TABLE IF EXISTS "nets";
CREATE TABLE "nets" (
  "net_id" int NOT NULL,
  "net_level" int DEFAULT NULL,
  "net_address" int DEFAULT NULL,
  "parent_net_id" int DEFAULT NULL,
  "first_net_id" int DEFAULT NULL,
  "full_net_address" int DEFAULT NULL,
  "count_of_nets" int DEFAULT NULL
);

-- ALTER TABLE "nets"
--   ADD PRIMARY KEY ("net_id");

-- --------------------------------------------------------

--
-- Структура таблицi "nets_data"
--

DROP TABLE IF EXISTS "nets_data";
CREATE TABLE "nets_data" (
  "net_id" int NOT NULL,
  "name" varchar(50) DEFAULT NULL,
  "goal" text,
  "resource_name_1" varchar(50) DEFAULT NULL,
  "resource_link_1" varchar(255) DEFAULT NULL,
  "resource_name_2" varchar(50) DEFAULT NULL,
  "resource_link_2" varchar(255) DEFAULT NULL,
  "resource_name_3" varchar(50) DEFAULT NULL,
  "resource_link_3" varchar(255) DEFAULT NULL,
  "resource_name_4" varchar(50) DEFAULT NULL,
  "resource_link_4" varchar(255) DEFAULT NULL
);

CREATE UNIQUE INDEX akUniqNet ON "nets_data" ("net_id");

-- ALTER TABLE "nets_data"
--   ADD PRIMARY KEY ("net_id");

-- --------------------------------------------------------

--
-- Структура таблицi "nets_events"
--

DROP TABLE IF EXISTS "nets_events";
CREATE TABLE "nets_events" (
  "event_id" bigint generated always as identity,
  "net_id" int DEFAULT NULL,
  "user_id" int DEFAULT NULL,
  "event_node_id" int DEFAULT NULL,
  "notification_tpl_id" int DEFAULT NULL,
  "event_code" int DEFAULT NULL,
  "notification_text" varchar(255) DEFAULT NULL,
  "new" bit(1) DEFAULT b'1',
  "shown" bit(1) DEFAULT b'0'
);

-- ALTER TABLE "nets_events"
--   ADD PRIMARY KEY ("event_id");

-- --------------------------------------------------------

--
-- Структура таблицi "nets_users_data"
--

DROP TABLE IF EXISTS "nets_users_data";
CREATE TABLE "nets_users_data" (
  "net_id" int DEFAULT NULL,
  "user_id" int DEFAULT NULL,
  "email_show" bit(1) DEFAULT b'0',
  "name_show" bit(1) DEFAULT b'0',
  "mobile_show" bit(1) DEFAULT b'0'
);

CREATE UNIQUE INDEX akUniqNetUser ON "nets_users_data" ("net_id","user_id");

-- --------------------------------------------------------

--
-- Структура таблицi "nodes"
--

DROP TABLE IF EXISTS "nodes";
CREATE TABLE "nodes" (
  "node_id" bigint generated always as identity,
  "node_level" int DEFAULT NULL,
  "node_address" int DEFAULT NULL,
  "parent_node_id" int DEFAULT NULL,
  "first_node_id" int DEFAULT NULL,
  "full_node_address" int DEFAULT NULL,
  "count_of_members" int DEFAULT NULL,
  "node_date" TIMESTAMP DEFAULT NULL,
  "blocked" bit(1) DEFAULT NULL,
  "changes" bit(1) DEFAULT NULL
);

-- ALTER TABLE "nodes"
--   ADD PRIMARY KEY ("node_id");

-- --------------------------------------------------------

--
-- Структура таблицi "nodes_tmp"
--

DROP TABLE IF EXISTS "nodes_tmp";
CREATE TABLE "nodes_tmp" (
  "node_id" int DEFAULT NULL,
  "email" varchar(50) DEFAULT NULL,
  "list_name" varchar(50) DEFAULT NULL,
  "note" varchar(255) DEFAULT NULL
);

CREATE UNIQUE INDEX akNodeId ON "nodes_tmp" ("node_id");

-- --------------------------------------------------------

--
-- Структура таблицi "nodes_users"
--

DROP TABLE IF EXISTS "nodes_users";
CREATE TABLE "nodes_users" (
  "node_id" int NOT NULL,
  "user_id" int DEFAULT NULL,
  "invite" varchar(255) DEFAULT NULL,
  "old_list_name" varchar(50) DEFAULT NULL,
  "old_list_note" varchar(255) DEFAULT NULL
);

-- ALTER TABLE "nodes_users"
--   ADD PRIMARY KEY ("node_id");

-- --------------------------------------------------------

--
-- Структура таблицi "notifications_tpl"
--

DROP TABLE IF EXISTS "notifications_tpl";
CREATE TABLE "notifications_tpl" (
  "notification_tpl_id" bigint generated always as identity,
  "event_code" int DEFAULT NULL,
  "notification_code" int DEFAULT NULL,
  "notification_text" varchar(255) DEFAULT NULL,
  "notification_action" varchar(255) DEFAULT NULL,
  "notification_close" bit(1) DEFAULT b'0'
);

-- ALTER TABLE "notifications_tpl"
--   ADD PRIMARY KEY ("notification_tpl_id");

-- --------------------------------------------------------

--
-- Структура таблицi "users"
--

DROP TABLE IF EXISTS "users";
CREATE TABLE "users" (
  "user_id" bigint generated always as identity ( INCREMENT 1 START 100 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 100 ),
  "email" varchar(50) DEFAULT NULL,
  "name" varchar(50) DEFAULT NULL,
  "mobile" varchar(255) DEFAULT NULL,
  "password" varchar(255) DEFAULT NULL,
  "link" varchar(255) DEFAULT NULL,
  "invite" varchar(255) DEFAULT NULL,
  "restore" varchar(255) DEFAULT NULL,
  "net_name" varchar(50) DEFAULT NULL
);

CREATE UNIQUE INDEX akEmail ON "users" ("email");

-- ALTER TABLE "users"
--   ADD PRIMARY KEY ("user_id");

-- --------------------------------------------------------

--
-- Структура таблицi "users_notifications"
--

DROP TABLE IF EXISTS "users_notifications";
CREATE TABLE "users_notifications" (
  "notification_id" bigint generated always as identity,
  "user_id" int DEFAULT NULL,
  "code" int DEFAULT NULL,
  "notification" varchar(511) DEFAULT NULL,
  "new" bit(1) DEFAULT b'1',
  "shown" bit(1) DEFAULT b'0',
  "close" bit(1) DEFAULT b'0'
);

-- ALTER TABLE "users_notifications"
--   ADD PRIMARY KEY ("notification_id");

-- --------------------------------------------------------

--
-- Структура таблицi "sessions"
--

DROP TABLE IF EXISTS "sessions";
CREATE TABLE "sessions" (
  "session_id" bigint generated always as identity,
  "session_key" varchar(255) NOT NULL,
  "session_value" varchar(255) NOT NULL
);

-- ALTER TABLE "sessions"
--   ADD PRIMARY KEY ("session_id");
CREATE UNIQUE INDEX akSessionKey ON "sessions" ("session_key");
