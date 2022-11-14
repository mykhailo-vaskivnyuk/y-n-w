CREATE TABLE "nets" (
  "net_id" bigint PRIMARY KEY NOT NULL,
  "net_level" integer,
  "net_address" integer,
  "parent_net_id" integer,
  "first_net_id" integer,
  "full_net_address" integer,
  "count_of_nets" integer
);

CREATE TABLE "nets_data" (
  "net_id" bigint NOT NULL,
  "name" character varying(50) DEFAULT NULL,
  "goal" text,
  "resource_name_1" character varying(50) DEFAULT NULL,
  "resource_link_1" character varying(255) DEFAULT NULL,
  "resource_name_2" character varying(50) DEFAULT NULL,
  "resource_link_2" character varying(255) DEFAULT NULL,
  "resource_name_3" character varying(50) DEFAULT NULL,
  "resource_link_3" character varying(255) DEFAULT NULL,
  "resource_name_4" character varying(50) DEFAULT NULL,
  "resource_link_4" character varying(255) DEFAULT NULL
);

CREATE TABLE "nets_users_data" (
  "net_id" bigint NOT NULL,
  "user_id" bigint NOT NULL,
  "email_show" bit(1) DEFAULT '0',
  "name_show" bit(1) DEFAULT '0',
  "mobile_show" bit(1) DEFAULT '0'
);

CREATE TABLE "nodes" (
  "node_id" bigint PRIMARY KEY NOT NULL,
  "node_level" integer,
  "node_address" integer,
  "parent_node_id" integer,
  "first_node_id" integer,
  "full_node_address" integer,
  "count_of_members" integer,
  "node_date" timestamp,
  "blocked" bit(1) DEFAULT NULL,
  "changes" bit(1) DEFAULT NULL
);

CREATE TABLE "nodes_nets" (
  "node_id" bigint NOT NULL,
  "net_id" bigint NOT NULL
);

CREATE TABLE "nodes_users" (
  "node_id" bigint NOT NULL,
  "user_id" bigint NOT NULL,
  "invite" character varying(255) DEFAULT NULL,
  "old_list_name" character varying(50) DEFAULT NULL,
  "old_list_note" character varying(255) DEFAULT NULL
);

CREATE TABLE "sessions" (
  "session_id" bigint PRIMARY KEY NOT NULL,
  "session_key" character varying(255) NOT NULL,
  "session_value" character varying(255) NOT NULL
);

CREATE TABLE "users" (
  "user_id" bigint PRIMARY KEY NOT NULL,
  "email" character varying(50) NOT NULL,
  "name" character varying(50) DEFAULT NULL,
  "mobile" character varying(255) DEFAULT NULL,
  "password" character varying(255) DEFAULT NULL,
  "link" character varying(255) DEFAULT NULL,
  "invite" character varying(255) DEFAULT NULL,
  "restore" character varying(255) DEFAULT NULL,
  "net_name" character varying(50) DEFAULT NULL
);

CREATE UNIQUE INDEX ON "nodes_nets" ("node_id");

CREATE UNIQUE INDEX "ukNodeNet" ON "nodes_nets" ("node_id", "net_id");

CREATE UNIQUE INDEX ON "nodes_users" ("node_id");

CREATE UNIQUE INDEX "ukNodeUser" ON "nodes_users" ("node_id", "user_id");

CREATE UNIQUE INDEX ON "users" ("email");

ALTER TABLE "nets_data" ADD CONSTRAINT "fkNetsDataNet" FOREIGN KEY ("net_id") REFERENCES "nets" ("net_id");

ALTER TABLE "nets_users_data" ADD CONSTRAINT "fkNetsUsersDataNet" FOREIGN KEY ("net_id") REFERENCES "nets" ("net_id");

ALTER TABLE "nets_users_data" ADD CONSTRAINT "fkNetsUsersDataUser" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE;

ALTER TABLE "nodes_nets" ADD CONSTRAINT "fkNodesNetsNode" FOREIGN KEY ("node_id") REFERENCES "nodes" ("node_id");

ALTER TABLE "nodes_nets" ADD CONSTRAINT "fkNodesNetsNet" FOREIGN KEY ("net_id") REFERENCES "nets" ("net_id");

ALTER TABLE "nodes_users" ADD CONSTRAINT "fkNodesUsersNode" FOREIGN KEY ("node_id") REFERENCES "nodes" ("node_id");

ALTER TABLE "nodes_users" ADD CONSTRAINT "fkNodesUsersUser" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");
