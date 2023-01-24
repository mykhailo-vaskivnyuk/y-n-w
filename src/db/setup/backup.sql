--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3
-- Dumped by pg_dump version 14.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: nets; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nets (
    net_node_id bigint NOT NULL,
    net_level integer DEFAULT 0 NOT NULL,
    parent_net_id bigint,
    first_net_id bigint,
    count_of_nets integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.nets OWNER TO merega;

--
-- Name: nets_data; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nets_data (
    net_node_id bigint NOT NULL,
    name character varying(50) NOT NULL,
    goal text DEFAULT NULL::character varying,
    resource_name character varying(50) DEFAULT NULL::character varying,
    resource_link character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.nets_data OWNER TO merega;

--
-- Name: nets_users_data; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nets_users_data (
    node_id bigint NOT NULL,
    net_node_id bigint NOT NULL,
    user_id bigint NOT NULL,
    email_show boolean DEFAULT false NOT NULL,
    name_show boolean DEFAULT false NOT NULL,
    mobile_show boolean DEFAULT false NOT NULL,
    confirmed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.nets_users_data OWNER TO merega;

--
-- Name: nets_users_data_tmp; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nets_users_data_tmp (
    node_id bigint NOT NULL,
    net_node_id bigint NOT NULL,
    user_id bigint NOT NULL,
    email_show boolean DEFAULT false NOT NULL,
    name_show boolean DEFAULT false NOT NULL,
    mobile_show boolean DEFAULT false NOT NULL,
    confirmed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.nets_users_data_tmp OWNER TO merega;

--
-- Name: nodes; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nodes (
    node_id bigint NOT NULL,
    node_level integer DEFAULT 0 NOT NULL,
    node_position integer DEFAULT 0 NOT NULL,
    parent_node_id bigint,
    net_node_id bigint,
    count_of_members integer DEFAULT 0 NOT NULL,
    updated timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.nodes OWNER TO merega;

--
-- Name: nodes_invites; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nodes_invites (
    parent_node_id bigint NOT NULL,
    node_id bigint NOT NULL,
    member_name character varying(50) NOT NULL,
    token character varying(255) NOT NULL
);


ALTER TABLE public.nodes_invites OWNER TO merega;

--
-- Name: nodes_node_id_seq; Type: SEQUENCE; Schema: public; Owner: merega
--

ALTER TABLE public.nodes ALTER COLUMN node_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.nodes_node_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.sessions (
    session_id bigint NOT NULL,
    user_id bigint NOT NULL,
    session_key character varying(255) NOT NULL,
    session_value character varying(255) NOT NULL,
    updated timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sessions OWNER TO merega;

--
-- Name: sessions_session_id_seq; Type: SEQUENCE; Schema: public; Owner: merega
--

ALTER TABLE public.sessions ALTER COLUMN session_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.sessions_session_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users (
    user_id bigint NOT NULL,
    email character varying(50) NOT NULL,
    name character varying(50) DEFAULT NULL::character varying,
    mobile character varying(50) DEFAULT NULL::character varying,
    password character varying(255) DEFAULT NULL::character varying,
    confirmed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO merega;

--
-- Name: users_changes; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users_changes (
    user_id bigint NOT NULL,
    date timestamp without time zone NOT NULL
);


ALTER TABLE public.users_changes OWNER TO merega;

--
-- Name: users_members; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users_members (
    parent_node_id bigint NOT NULL,
    user_id bigint NOT NULL,
    member_id bigint NOT NULL,
    dislike boolean DEFAULT false NOT NULL,
    vote boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users_members OWNER TO merega;

--
-- Name: users_messages; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users_messages (
    message_id bigint NOT NULL,
    user_id bigint NOT NULL,
    user_node_id bigint,
    net_view character(10) NOT NULL,
    member_node_id bigint,
    message character varying(255) NOT NULL,
    date timestamp without time zone NOT NULL
);


ALTER TABLE public.users_messages OWNER TO merega;

--
-- Name: users_messages_message_id_seq; Type: SEQUENCE; Schema: public; Owner: merega
--

ALTER TABLE public.users_messages ALTER COLUMN message_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_messages_message_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users_tokens; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users_tokens (
    user_id bigint NOT NULL,
    token character varying(255) NOT NULL
);


ALTER TABLE public.users_tokens OWNER TO merega;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: merega
--

ALTER TABLE public.users ALTER COLUMN user_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: nets; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets (net_node_id, net_level, parent_net_id, first_net_id, count_of_nets) FROM stdin;
1	0	\N	1	1
\.


--
-- Data for Name: nets_data; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets_data (net_node_id, name, goal, resource_name, resource_link) FROM stdin;
1	My new network	\N	\N	\N
\.


--
-- Data for Name: nets_users_data; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets_users_data (node_id, net_node_id, user_id, email_show, name_show, mobile_show, confirmed) FROM stdin;
1	1	1	f	f	f	t
3	1	2	f	f	f	t
5	1	3	f	f	f	t
\.


--
-- Data for Name: nets_users_data_tmp; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets_users_data_tmp (node_id, net_node_id, user_id, email_show, name_show, mobile_show, confirmed) FROM stdin;
\.


--
-- Data for Name: nodes; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nodes (node_id, node_level, node_position, parent_node_id, net_node_id, count_of_members, updated) FROM stdin;
2	1	1	1	1	0	2023-01-08 13:27:19.209752
4	1	3	1	1	0	2023-01-08 13:27:19.209752
6	1	5	1	1	0	2023-01-08 13:27:19.209752
7	1	6	1	1	0	2023-01-08 13:27:19.209752
3	1	2	1	1	1	2023-01-08 13:27:19.209752
8	2	1	3	1	0	2023-01-08 20:15:48.206688
9	2	2	3	1	0	2023-01-08 20:15:48.206688
10	2	3	3	1	0	2023-01-08 20:15:48.206688
11	2	4	3	1	0	2023-01-08 20:15:48.206688
12	2	5	3	1	0	2023-01-08 20:15:48.206688
13	2	6	3	1	0	2023-01-08 20:15:48.206688
5	1	4	1	1	1	2023-01-08 13:27:19.209752
1	0	0	\N	1	3	2023-01-08 13:27:19.186211
14	2	1	5	1	0	2023-01-10 21:21:58.740173
15	2	2	5	1	0	2023-01-10 21:21:58.740173
16	2	3	5	1	0	2023-01-10 21:21:58.740173
17	2	4	5	1	0	2023-01-10 21:21:58.740173
18	2	5	5	1	0	2023-01-10 21:21:58.740173
19	2	6	5	1	0	2023-01-10 21:21:58.740173
\.


--
-- Data for Name: nodes_invites; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nodes_invites (parent_node_id, node_id, member_name, token) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.sessions (session_id, user_id, session_key, session_value, updated) FROM stdin;
41	2	78d6df1b8ef8b21e2ea3062a6522cd	{"user_id":"2","user_status":"LOGGEDIN"}	2023-01-19 16:24:56.265
28	2	4975db69aa323f2152c94bb1004650	{"user_id":"2","user_status":"LOGGEDIN"}	2023-01-16 16:19:38.416747
36	2	a16279b7f535d77b158ddd4af0aff0	{"user_id":"2","user_status":"LOGGEDIN"}	2023-01-18 16:38:07.907347
31	3	909407aa548d0d75c70f140cb42b4e	{"user_id":"3","user_status":"LOGGEDIN"}	2023-01-16 21:10:02.061277
30	2	a516286bb6146b2b91f90ee3c7624e	{"user_id":"2","user_status":"LOGGEDIN"}	2023-01-16 21:10:16.292129
38	2	309eccfab1c0c07267f352bc46bab9	{"user_id":"2","user_status":"LOGGEDIN"}	2023-01-18 16:38:39.854006
21	3	68438995ae426e4b693790048f18cb	{"user_id":"3","user_status":"LOGGEDIN"}	2023-01-11 19:51:21.154109
19	2	d78abd8b5a02373468a1aee6af84ab	{"user_id":"2","user_status":"LOGGEDIN"}	2023-01-11 19:51:46.594308
42	3	fe6df4e33b7420e0e198cea0726d9b	{"user_id":"3","user_status":"LOGGEDIN"}	2023-01-19 16:24:56.414605
20	3	399a47fd4d6c260ac77c5fd1b7cb21	{"user_id":"3","user_status":"LOGGEDIN"}	2023-01-11 19:32:37.478999
27	2	ae85a9a5507747419293eb8e65d16a	{"user_id":"2","user_status":"LOGGEDIN"}	2023-01-13 18:58:51.423334
39	2	2ddb467fa0c2fa4cc53681c3bcccd7	{"user_id":"2","user_status":"LOGGEDIN"}	2023-01-18 18:46:32.018339
32	2	3102a9b38ee5e08dbcd9a3ab946fcd	{"user_id":"2","user_status":"LOGGEDIN"}	2023-01-18 15:30:50.746464
22	1	8ae0a34d58375ff02022626ef33f71	{"user_id":"1","user_status":"LOGGEDIN"}	2023-01-11 21:08:32.05622
44	2	0588975b7cda4391ad4db93df159cf	{"user_id":"2","user_status":"LOGGEDIN"}	2023-01-20 16:53:22.963848
26	2	aa02f5b34800f8681bd0509401b6d0	{"user_id":"2","user_status":"LOGGEDIN"}	2023-01-12 18:27:01.228986
37	3	df9ed40c17fc3c343884bb76b01c11	{"user_id":"3","user_status":"LOGGEDIN"}	2023-01-18 16:28:30.467176
40	3	19dbd8299f9df97f67987fc2909bd8	{"user_id":"3","user_status":"LOGGEDIN"}	2023-01-18 18:46:43.269426
33	3	1a838e4ab6030fd6b374c2dc7ee64b	{"user_id":"3","user_status":"LOGGEDIN"}	2023-01-18 15:59:39.0693
29	3	278d90b7289a3999b4c797dc9d8ce0	{"user_id":"3","user_status":"LOGGEDIN"}	2023-01-16 16:19:09.952988
35	2	25ad20fdbdc955003b9dc9584c8fc4	{"user_id":"2","user_status":"LOGGEDIN"}	2023-01-18 16:00:20.382842
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users (user_id, email, name, mobile, password, confirmed) FROM stdin;
1	user01@gmail.com	\N	\N	ee5d3bb0f5f23cf735caea21a4321116:53be5841d206ea53f4aab75bbe1072dac00f203dcc812ca77c0fab776e566a6cb519348d4a2a9eeb26d549d46792e9fa70092254a1cbc4bb58df316662147fbb	t
2	user02@gmail.com	\N	\N	8317b53f9189781a5aec6b8c4d1fdd83:235c7d0fff5c8d74fa0de478da7b1269397f6f14cc81f9f1f1d04d96637cfc41de78a375e728eaf0ab985877c5fcfdf40becaf2a458f52c1f36eea5fb96ca9d3	t
3	user03@gmail.com	\N	\N	428505ea613e395075de8335d6c11f1a:801e1098928a65226c5ea0edb379c5bedfd81e07211b15b80ad5e48e4efc89bb2de79e038da105aaf70a19d59e318c0c45648b1f4c38a14fc1e8a6aadae3ba56	t
\.


--
-- Data for Name: users_changes; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users_changes (user_id, date) FROM stdin;
\.


--
-- Data for Name: users_members; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users_members (parent_node_id, user_id, member_id, dislike, vote) FROM stdin;
1	1	2	f	f
1	3	2	f	f
1	3	3	f	f
1	2	2	f	f
1	2	3	f	t
\.


--
-- Data for Name: users_messages; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users_messages (message_id, user_id, user_node_id, net_view, member_node_id, message, date) FROM stdin;
\.


--
-- Data for Name: users_tokens; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users_tokens (user_id, token) FROM stdin;
\.


--
-- Name: nodes_node_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.nodes_node_id_seq', 19, true);


--
-- Name: sessions_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.sessions_session_id_seq', 44, true);


--
-- Name: users_messages_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.users_messages_message_id_seq', 1, false);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);


--
-- Name: nets pk_nets; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets
    ADD CONSTRAINT pk_nets PRIMARY KEY (net_node_id);


--
-- Name: nets_data pk_nets_data; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_data
    ADD CONSTRAINT pk_nets_data PRIMARY KEY (net_node_id);


--
-- Name: nets_users_data pk_nets_users_data; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT pk_nets_users_data PRIMARY KEY (node_id);


--
-- Name: nets_users_data_tmp pk_nets_users_data_tmp; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data_tmp
    ADD CONSTRAINT pk_nets_users_data_tmp PRIMARY KEY (user_id, net_node_id);


--
-- Name: nodes pk_nodes; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT pk_nodes PRIMARY KEY (node_id);


--
-- Name: sessions pk_sessions; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT pk_sessions PRIMARY KEY (session_id);


--
-- Name: users pk_users; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT pk_users PRIMARY KEY (user_id);


--
-- Name: users_changes pk_users_changes; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_changes
    ADD CONSTRAINT pk_users_changes PRIMARY KEY (user_id);


--
-- Name: users_members pk_users_members; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_members
    ADD CONSTRAINT pk_users_members PRIMARY KEY (parent_node_id, user_id, member_id);


--
-- Name: users_messages pk_users_messages; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_messages
    ADD CONSTRAINT pk_users_messages PRIMARY KEY (message_id);


--
-- Name: nodes_invites pk_users_nodes_invites; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_invites
    ADD CONSTRAINT pk_users_nodes_invites PRIMARY KEY (node_id);


--
-- Name: users_tokens pk_users_tokens; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT pk_users_tokens PRIMARY KEY (user_id);


--
-- Name: users uk_email; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_email UNIQUE (email);


--
-- Name: nets_users_data uk_nets_users_data_user_net_node; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT uk_nets_users_data_user_net_node UNIQUE (user_id, net_node_id);


--
-- Name: nodes uk_nodes_node_net_node; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT uk_nodes_node_net_node UNIQUE (node_id, net_node_id);


--
-- Name: nodes uk_nodes_node_parent_node; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT uk_nodes_node_parent_node UNIQUE (node_id, parent_node_id);


--
-- Name: nodes_invites uk_users_nodes_invites_token; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_invites
    ADD CONSTRAINT uk_users_nodes_invites_token UNIQUE (token);


--
-- Name: users_tokens uk_users_tokens_token; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT uk_users_tokens_token UNIQUE (token);


--
-- Name: sk_users_messages_user; Type: INDEX; Schema: public; Owner: merega
--

CREATE INDEX sk_users_messages_user ON public.users_messages USING btree (user_id);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_nodes_invites_token_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX users_nodes_invites_token_idx ON public.nodes_invites USING btree (token);


--
-- Name: users_tokens_token_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX users_tokens_token_idx ON public.users_tokens USING btree (token);


--
-- Name: nets_data fk_nets_data_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_data
    ADD CONSTRAINT fk_nets_data_node FOREIGN KEY (net_node_id) REFERENCES public.nodes(node_id) ON DELETE CASCADE;


--
-- Name: nets fk_nets_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets
    ADD CONSTRAINT fk_nets_node FOREIGN KEY (net_node_id) REFERENCES public.nodes(node_id) ON DELETE CASCADE;


--
-- Name: nets_users_data fk_nets_users_data_node_net_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT fk_nets_users_data_node_net_node FOREIGN KEY (node_id, net_node_id) REFERENCES public.nodes(node_id, net_node_id) ON UPDATE CASCADE;


--
-- Name: nets_users_data fk_nets_users_data_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT fk_nets_users_data_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: nodes_invites fk_nodes_invites_node_parent_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_invites
    ADD CONSTRAINT fk_nodes_invites_node_parent_node FOREIGN KEY (node_id, parent_node_id) REFERENCES public.nodes(node_id, parent_node_id) ON UPDATE CASCADE;


--
-- Name: nodes_invites fk_nodes_invites_parent_user_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_invites
    ADD CONSTRAINT fk_nodes_invites_parent_user_node FOREIGN KEY (parent_node_id) REFERENCES public.nets_users_data(node_id) ON DELETE CASCADE;


--
-- Name: sessions fk_sessions_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: users_changes fk_users_changes_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_changes
    ADD CONSTRAINT fk_users_changes_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: users_members fk_users_members_member; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_members
    ADD CONSTRAINT fk_users_members_member FOREIGN KEY (member_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: users_members fk_users_members_parent_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_members
    ADD CONSTRAINT fk_users_members_parent_node FOREIGN KEY (parent_node_id) REFERENCES public.nodes(node_id);


--
-- Name: users_members fk_users_members_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_members
    ADD CONSTRAINT fk_users_members_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: users_messages fk_users_messages_member_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_messages
    ADD CONSTRAINT fk_users_messages_member_node FOREIGN KEY (member_node_id) REFERENCES public.nodes(node_id) ON DELETE CASCADE;


--
-- Name: users_messages fk_users_messages_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_messages
    ADD CONSTRAINT fk_users_messages_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: users_messages fk_users_messages_user_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_messages
    ADD CONSTRAINT fk_users_messages_user_node FOREIGN KEY (user_node_id) REFERENCES public.nets_users_data(node_id) ON DELETE SET NULL;


--
-- Name: users_tokens fk_users_tokens_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT fk_users_tokens_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

