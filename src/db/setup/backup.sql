--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

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
-- Name: board_messages; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.board_messages (
    message_id bigint NOT NULL,
    net_id bigint NOT NULL,
    member_id bigint NOT NULL,
    message character varying(255) NOT NULL,
    date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.board_messages OWNER TO merega;

--
-- Name: board_messages_message_id_seq; Type: SEQUENCE; Schema: public; Owner: merega
--

ALTER TABLE public.board_messages ALTER COLUMN message_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.board_messages_message_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: events; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.events (
    event_id bigint NOT NULL,
    user_id bigint NOT NULL,
    net_id bigint,
    net_view character(10) DEFAULT NULL::bpchar,
    from_node_id bigint,
    event_type character(20) NOT NULL,
    message character varying(255) NOT NULL,
    date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.events OWNER TO merega;

--
-- Name: events_event_id_seq; Type: SEQUENCE; Schema: public; Owner: merega
--

ALTER TABLE public.events ALTER COLUMN event_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.events_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: members; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.members (
    member_id bigint NOT NULL,
    user_id bigint,
    email_show boolean DEFAULT false NOT NULL,
    name_show boolean DEFAULT false NOT NULL,
    mobile_show boolean DEFAULT false NOT NULL,
    confirmed boolean DEFAULT false NOT NULL,
    active_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.members OWNER TO merega;

--
-- Name: members_invites; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.members_invites (
    member_id bigint NOT NULL,
    node_id bigint NOT NULL,
    member_name character varying(50) NOT NULL,
    token character varying(255) NOT NULL
);


ALTER TABLE public.members_invites OWNER TO merega;

--
-- Name: members_to_members; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.members_to_members (
    branch_id bigint NOT NULL,
    from_member_id bigint NOT NULL,
    to_member_id bigint NOT NULL,
    dislike boolean DEFAULT false NOT NULL,
    vote boolean DEFAULT false NOT NULL
);


ALTER TABLE public.members_to_members OWNER TO merega;

--
-- Name: nets; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nets (
    net_id bigint NOT NULL,
    net_level integer DEFAULT 0 NOT NULL,
    parent_net_id bigint,
    root_net_id bigint,
    count_of_nets integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.nets OWNER TO merega;

--
-- Name: nets_data; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nets_data (
    net_id bigint NOT NULL,
    name character varying(50) NOT NULL,
    goal text DEFAULT NULL::character varying,
    resource_name character varying(50) DEFAULT NULL::character varying,
    net_link character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.nets_data OWNER TO merega;

--
-- Name: nets_guests; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nets_guests (
    net_id bigint NOT NULL,
    user_id bigint NOT NULL,
    comment character varying(255) NOT NULL
);


ALTER TABLE public.nets_guests OWNER TO merega;

--
-- Name: nets_net_id_seq; Type: SEQUENCE; Schema: public; Owner: merega
--

ALTER TABLE public.nets ALTER COLUMN net_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.nets_net_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: nodes; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nodes (
    node_id bigint NOT NULL,
    node_level integer DEFAULT 0 NOT NULL,
    parent_node_id bigint,
    net_id bigint NOT NULL,
    node_position integer DEFAULT 0 NOT NULL,
    count_of_members integer DEFAULT 0 NOT NULL,
    updated timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.nodes OWNER TO merega;

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
    email character varying(50) DEFAULT NULL::character varying,
    name character varying(50) DEFAULT NULL::character varying,
    mobile character varying(50) DEFAULT NULL::character varying,
    password character varying(255) DEFAULT NULL::character varying,
    confirmed boolean DEFAULT false NOT NULL,
    chat_id character varying(50) DEFAULT NULL::character varying
);


ALTER TABLE public.users OWNER TO merega;

--
-- Name: users_events; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users_events (
    user_id bigint NOT NULL,
    notification_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users_events OWNER TO merega;

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
-- Data for Name: board_messages; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.board_messages (message_id, net_id, member_id, message, date) FROM stdin;
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.events (event_id, user_id, net_id, net_view, from_node_id, event_type, message, date) FROM stdin;
\.


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.members (member_id, user_id, email_show, name_show, mobile_show, confirmed, active_date) FROM stdin;
1	1	f	f	f	t	2023-01-08 13:27:19.209752
3	2	f	f	f	t	2023-01-08 13:27:19.209752
5	3	f	f	f	t	2023-01-08 13:27:19.209752
7	4	f	f	f	f	2023-01-08 13:27:19.209752
\.


--
-- Data for Name: members_invites; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.members_invites (member_id, node_id, member_name, token) FROM stdin;
\.


--
-- Data for Name: members_to_members; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.members_to_members (branch_id, from_member_id, to_member_id, dislike, vote) FROM stdin;
\.


--
-- Data for Name: nets; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets (net_id, net_level, parent_net_id, root_net_id, count_of_nets) FROM stdin;
1	0	\N	1	1
\.


--
-- Data for Name: nets_data; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets_data (net_id, name, goal, resource_name, net_link) FROM stdin;
1	Моя спільнота	Мета моєї спільноти	\N	\N
\.


--
-- Data for Name: nets_guests; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets_guests (net_id, user_id, comment) FROM stdin;
\.


--
-- Data for Name: nodes; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nodes (node_id, node_level, parent_node_id, net_id, node_position, count_of_members, updated) FROM stdin;
2	1	1	1	0	0	2023-01-08 13:27:19.209752
4	1	1	1	2	0	2023-01-08 13:27:19.209752
6	1	1	1	4	0	2023-01-08 13:27:19.209752
7	1	1	1	5	0	2023-01-08 13:27:19.209752
3	1	1	1	1	1	2023-01-08 13:27:19.209752
8	2	3	1	0	0	2023-01-08 20:15:48.206688
9	2	3	1	1	0	2023-01-08 20:15:48.206688
10	2	3	1	2	0	2023-01-08 20:15:48.206688
11	2	3	1	3	0	2023-01-08 20:15:48.206688
12	2	3	1	4	0	2023-01-08 20:15:48.206688
13	2	3	1	5	0	2023-01-08 20:15:48.206688
5	1	1	1	3	1	2023-01-08 13:27:19.209752
1	0	\N	1	0	3	2023-01-08 13:27:19.186211
14	2	5	1	0	0	2023-01-10 21:21:58.740173
15	2	5	1	1	0	2023-01-10 21:21:58.740173
16	2	5	1	2	0	2023-01-10 21:21:58.740173
17	2	5	1	3	0	2023-01-10 21:21:58.740173
18	2	5	1	4	0	2023-01-10 21:21:58.740173
19	2	5	1	5	0	2023-01-10 21:21:58.740173
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.sessions (session_id, user_id, session_key, session_value, updated) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users (user_id, email, name, mobile, password, confirmed, chat_id) FROM stdin;
1	user01@gmail.com	Учасник 1	\N	ee5d3bb0f5f23cf735caea21a4321116:53be5841d206ea53f4aab75bbe1072dac00f203dcc812ca77c0fab776e566a6cb519348d4a2a9eeb26d549d46792e9fa70092254a1cbc4bb58df316662147fbb	t	\N
2	user02@gmail.com	Учасник 2	\N	8317b53f9189781a5aec6b8c4d1fdd83:235c7d0fff5c8d74fa0de478da7b1269397f6f14cc81f9f1f1d04d96637cfc41de78a375e728eaf0ab985877c5fcfdf40becaf2a458f52c1f36eea5fb96ca9d3	t	\N
3	user03@gmail.com	Учасник 3	\N	428505ea613e395075de8335d6c11f1a:801e1098928a65226c5ea0edb379c5bedfd81e07211b15b80ad5e48e4efc89bb2de79e038da105aaf70a19d59e318c0c45648b1f4c38a14fc1e8a6aadae3ba56	t	\N
4	user04@gmail.com	Учасник 4	\N	72f7b8c5e2f2a7eca7d4f86667274ef2:83ea46cd83030580f8d97fa4d622de348c536377228a759472419275630cd91be64db1bdf304795988b539f35f836883f6f8618ad5aaeb6c50bf5aaf538682ef	t	\N
\.


--
-- Data for Name: users_events; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users_events (user_id, notification_date) FROM stdin;
\.


--
-- Data for Name: users_tokens; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users_tokens (user_id, token) FROM stdin;
\.


--
-- Name: board_messages_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.board_messages_message_id_seq', 1, false);


--
-- Name: events_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.events_event_id_seq', 1, false);


--
-- Name: nets_net_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.nets_net_id_seq', 1, true);


--
-- Name: nodes_node_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.nodes_node_id_seq', 19, true);


--
-- Name: sessions_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.sessions_session_id_seq', 48, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.users_user_id_seq', 4, true);


--
-- Name: board_messages pk_board_messages; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.board_messages
    ADD CONSTRAINT pk_board_messages PRIMARY KEY (message_id);


--
-- Name: events pk_events; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT pk_events PRIMARY KEY (event_id);


--
-- Name: members pk_members; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT pk_members PRIMARY KEY (member_id);


--
-- Name: members_invites pk_members_invites; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members_invites
    ADD CONSTRAINT pk_members_invites PRIMARY KEY (node_id);


--
-- Name: members_to_members pk_members_to_members; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members_to_members
    ADD CONSTRAINT pk_members_to_members PRIMARY KEY (from_member_id, to_member_id);


--
-- Name: nets pk_nets; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets
    ADD CONSTRAINT pk_nets PRIMARY KEY (net_id);


--
-- Name: nets_data pk_nets_data; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_data
    ADD CONSTRAINT pk_nets_data PRIMARY KEY (net_id);


--
-- Name: nets_guests pk_nets_guests; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_guests
    ADD CONSTRAINT pk_nets_guests PRIMARY KEY (net_id, user_id);


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
-- Name: users_events pk_users_events; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_events
    ADD CONSTRAINT pk_users_events PRIMARY KEY (user_id);


--
-- Name: users_tokens pk_users_tokens; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT pk_users_tokens PRIMARY KEY (user_id);


--
-- Name: users uk_chat_id; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_chat_id UNIQUE (chat_id);


--
-- Name: users uk_email; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_email UNIQUE (email);


--
-- Name: members_invites uk_members_invites_token; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members_invites
    ADD CONSTRAINT uk_members_invites_token UNIQUE (token);


--
-- Name: users_tokens uk_users_tokens_token; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT uk_users_tokens_token UNIQUE (token);


--
-- Name: members_invites_token_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX members_invites_token_idx ON public.members_invites USING btree (token);


--
-- Name: sk_board_messages_net; Type: INDEX; Schema: public; Owner: merega
--

CREATE INDEX sk_board_messages_net ON public.board_messages USING btree (net_id);


--
-- Name: sk_events_user; Type: INDEX; Schema: public; Owner: merega
--

CREATE INDEX sk_events_user ON public.events USING btree (user_id);


--
-- Name: sk_members_to_members_branch; Type: INDEX; Schema: public; Owner: merega
--

CREATE INDEX sk_members_to_members_branch ON public.members_to_members USING btree (branch_id);


--
-- Name: sk_members_user; Type: INDEX; Schema: public; Owner: merega
--

CREATE INDEX sk_members_user ON public.members USING btree (user_id);


--
-- Name: sk_nets_guests_net; Type: INDEX; Schema: public; Owner: merega
--

CREATE INDEX sk_nets_guests_net ON public.nets_guests USING btree (net_id);


--
-- Name: sk_nets_guests_user; Type: INDEX; Schema: public; Owner: merega
--

CREATE INDEX sk_nets_guests_user ON public.nets_guests USING btree (user_id);


--
-- Name: sk_nodes_parent_node; Type: INDEX; Schema: public; Owner: merega
--

CREATE INDEX sk_nodes_parent_node ON public.nodes USING btree (parent_node_id NULLS FIRST);


--
-- Name: users_chat_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX users_chat_idx ON public.users USING btree (chat_id);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_tokens_token_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX users_tokens_token_idx ON public.users_tokens USING btree (token);


--
-- Name: board_messages fk_board_messages_member; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.board_messages
    ADD CONSTRAINT fk_board_messages_member FOREIGN KEY (member_id) REFERENCES public.members(member_id) ON DELETE CASCADE;


--
-- Name: board_messages fk_board_messages_net; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.board_messages
    ADD CONSTRAINT fk_board_messages_net FOREIGN KEY (net_id) REFERENCES public.nets(net_id);


--
-- Name: events fk_events_from_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_events_from_node FOREIGN KEY (from_node_id) REFERENCES public.nodes(node_id) ON DELETE CASCADE;


--
-- Name: events fk_events_net; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_events_net FOREIGN KEY (net_id) REFERENCES public.nets(net_id);


--
-- Name: events fk_events_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_events_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: members_invites fk_members_invites_member; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members_invites
    ADD CONSTRAINT fk_members_invites_member FOREIGN KEY (member_id) REFERENCES public.members(member_id) ON DELETE CASCADE;


--
-- Name: members_invites fk_members_invites_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members_invites
    ADD CONSTRAINT fk_members_invites_node FOREIGN KEY (node_id) REFERENCES public.nodes(node_id);


--
-- Name: members fk_members_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT fk_members_node FOREIGN KEY (member_id) REFERENCES public.nodes(node_id);


--
-- Name: members_to_members fk_members_to_members_from_member; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members_to_members
    ADD CONSTRAINT fk_members_to_members_from_member FOREIGN KEY (from_member_id) REFERENCES public.members(member_id) ON DELETE CASCADE;


--
-- Name: members_to_members fk_members_to_members_to_member; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members_to_members
    ADD CONSTRAINT fk_members_to_members_to_member FOREIGN KEY (to_member_id) REFERENCES public.members(member_id) ON DELETE CASCADE;


--
-- Name: members fk_members_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT fk_members_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: nets_data fk_nets_data_net; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_data
    ADD CONSTRAINT fk_nets_data_net FOREIGN KEY (net_id) REFERENCES public.nets(net_id) ON DELETE CASCADE;


--
-- Name: nets_guests fk_nets_guests_net; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_guests
    ADD CONSTRAINT fk_nets_guests_net FOREIGN KEY (net_id) REFERENCES public.nets(net_id) ON DELETE CASCADE;


--
-- Name: nets_guests fk_nets_guests_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_guests
    ADD CONSTRAINT fk_nets_guests_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: nodes fk_nodes_net; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT fk_nodes_net FOREIGN KEY (net_id) REFERENCES public.nets(net_id);


--
-- Name: sessions fk_sessions_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: users_events fk_users_events_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_events
    ADD CONSTRAINT fk_users_events_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: users_tokens fk_users_tokens_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT fk_users_tokens_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

