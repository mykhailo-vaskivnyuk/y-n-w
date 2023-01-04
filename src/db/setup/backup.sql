--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3
-- Dumped by pg_dump version 14.3

-- Started on 2022-12-30 22:44:15 EET

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

DROP DATABASE merega;
--
-- TOC entry 4419 (class 1262 OID 20057)
-- Name: merega; Type: DATABASE; Schema: -; Owner: merega
--

CREATE DATABASE merega WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE merega OWNER TO merega;

\connect merega

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
-- TOC entry 209 (class 1259 OID 20058)
-- Name: nets; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nets (
    net_id bigint NOT NULL,
    net_level integer DEFAULT 0 NOT NULL,
    parent_net_id bigint,
    first_net_id bigint,
    count_of_nets integer DEFAULT 1 NOT NULL,
    node_id bigint NOT NULL
);


ALTER TABLE public.nets OWNER TO merega;

--
-- TOC entry 210 (class 1259 OID 20063)
-- Name: nets_data; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nets_data (
    net_id bigint NOT NULL,
    name character varying(50) NOT NULL,
    goal text DEFAULT NULL::character varying,
    resource_name character varying(50) DEFAULT NULL::character varying,
    resource_link character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.nets_data OWNER TO merega;

--
-- TOC entry 211 (class 1259 OID 20071)
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
-- TOC entry 212 (class 1259 OID 20072)
-- Name: nets_users_data; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nets_users_data (
    net_id bigint NOT NULL,
    user_id bigint NOT NULL,
    email_show boolean DEFAULT false NOT NULL,
    name_show boolean DEFAULT false NOT NULL,
    mobile_show boolean DEFAULT false NOT NULL
);


ALTER TABLE public.nets_users_data OWNER TO merega;

--
-- TOC entry 213 (class 1259 OID 20078)
-- Name: nodes; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nodes (
    node_id bigint NOT NULL,
    node_level integer DEFAULT 0 NOT NULL,
    node_position integer DEFAULT 0 NOT NULL,
    parent_node_id bigint,
    first_node_id bigint,
    count_of_members integer DEFAULT 0 NOT NULL,
    node_date timestamp without time zone NOT NULL,
    blocked boolean DEFAULT false NOT NULL,
    changes boolean DEFAULT false NOT NULL,
    user_id bigint
);


ALTER TABLE public.nodes OWNER TO merega;

--
-- TOC entry 214 (class 1259 OID 20086)
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
-- TOC entry 215 (class 1259 OID 20087)
-- Name: sessions; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.sessions (
    session_id bigint NOT NULL,
    session_key character varying(255) NOT NULL,
    session_value character varying(255) NOT NULL
);


ALTER TABLE public.sessions OWNER TO merega;

--
-- TOC entry 216 (class 1259 OID 20092)
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
-- TOC entry 217 (class 1259 OID 20093)
-- Name: users; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users (
    user_id bigint NOT NULL,
    email character varying(50) NOT NULL,
    name character varying(50) DEFAULT NULL::character varying,
    mobile character varying(255) DEFAULT NULL::character varying,
    password character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.users OWNER TO merega;

--
-- TOC entry 218 (class 1259 OID 20101)
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
-- TOC entry 219 (class 1259 OID 20106)
-- Name: users_nodes_invites; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users_nodes_invites (
    node_id bigint NOT NULL,
    user_id bigint NOT NULL,
    member_name character varying(50) NOT NULL,
    token character varying(255) NOT NULL
);


ALTER TABLE public.users_nodes_invites OWNER TO merega;

--
-- TOC entry 220 (class 1259 OID 20109)
-- Name: users_tokens; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users_tokens (
    user_id bigint NOT NULL,
    confirm_token character varying(255),
    invite_token character varying(255) DEFAULT NULL::character varying,
    restore_token character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.users_tokens OWNER TO merega;

--
-- TOC entry 221 (class 1259 OID 20116)
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
-- TOC entry 4401 (class 0 OID 20058)
-- Dependencies: 209
-- Data for Name: nets; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets (net_id, net_level, parent_net_id, first_net_id, count_of_nets, node_id) FROM stdin;
1	0	\N	1	1	1
\.


--
-- TOC entry 4402 (class 0 OID 20063)
-- Dependencies: 210
-- Data for Name: nets_data; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets_data (net_id, name, goal, resource_name, resource_link) FROM stdin;
1	My new network	\N	\N	\N
\.


--
-- TOC entry 4404 (class 0 OID 20072)
-- Dependencies: 212
-- Data for Name: nets_users_data; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets_users_data (net_id, user_id, email_show, name_show, mobile_show) FROM stdin;
1	1	f	f	f
1	2	f	f	f
1	3	f	f	f
\.


--
-- TOC entry 4405 (class 0 OID 20078)
-- Dependencies: 213
-- Data for Name: nodes; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nodes (node_id, node_level, node_position, parent_node_id, first_node_id, count_of_members, node_date, blocked, changes, user_id) FROM stdin;
2	1	1	1	1	0	2022-12-30 20:40:43.739	f	f	\N
4	1	3	1	1	0	2022-12-30 20:40:43.739	f	f	\N
6	1	5	1	1	0	2022-12-30 20:40:43.739	f	f	\N
7	1	6	1	1	0	2022-12-30 20:40:43.739	f	f	\N
5	1	4	1	1	1	2022-12-30 20:40:43.739	f	f	2
3	1	2	1	1	1	2022-12-30 20:40:43.739	f	f	3
1	0	0	\N	1	3	2022-12-30 20:40:43.7	f	f	1
\.


--
-- TOC entry 4407 (class 0 OID 20087)
-- Dependencies: 215
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.sessions (session_id, session_key, session_value) FROM stdin;
4	8e1d580d72597f43aceaf504d2744a	{"user_id":"1","user_status":"LOGGEDIN"}
\.


--
-- TOC entry 4409 (class 0 OID 20093)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users (user_id, email, name, mobile, password) FROM stdin;
1	user01@gmail.com	\N	\N	5b200adeee981b3a15c789d840fb8178:8b9a873558d7de0e322b724f4a7db53149937491f9add1c812922dfebd00a4ddea4bedb0b2d5cfa3889c410b42f1a8d70b70c54a21011758f74575231c6d52d7
2	user02@gmail.com	\N	\N	9ee339cbe7bc2c27a10c843a7635d71c:cec5d5830d74beab9bd1c681c758bef02de46ed5ba10328261574e98d4984f53442be2f2824f33c2137cd707de1528ed1c0eb774857ed3d2ddf1cf1cdc0abd39
3	user03@gmail.com	\N	\N	8f8e221355e7e8123a2f365d908665c8:ff041e107dba49441713d454d360cfb689355070e6f12f9740804c34567ca9f02731b23df4859a91002d2d80335b695c303a5757e1b027dee697604a7f7235e7
\.


--
-- TOC entry 4410 (class 0 OID 20101)
-- Dependencies: 218
-- Data for Name: users_members; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users_members (parent_node_id, user_id, member_id, dislike, vote) FROM stdin;
\.


--
-- TOC entry 4411 (class 0 OID 20106)
-- Dependencies: 219
-- Data for Name: users_nodes_invites; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users_nodes_invites (node_id, user_id, member_name, token) FROM stdin;
\.


--
-- TOC entry 4412 (class 0 OID 20109)
-- Dependencies: 220
-- Data for Name: users_tokens; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users_tokens (user_id, confirm_token, invite_token, restore_token) FROM stdin;
\.


--
-- TOC entry 4420 (class 0 OID 0)
-- Dependencies: 211
-- Name: nets_net_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.nets_net_id_seq', 1, true);


--
-- TOC entry 4421 (class 0 OID 0)
-- Dependencies: 214
-- Name: nodes_node_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.nodes_node_id_seq', 7, true);


--
-- TOC entry 4422 (class 0 OID 0)
-- Dependencies: 216
-- Name: sessions_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.sessions_session_id_seq', 4, true);


--
-- TOC entry 4423 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);


--
-- TOC entry 4228 (class 2606 OID 20118)
-- Name: nets pk_nets; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets
    ADD CONSTRAINT pk_nets PRIMARY KEY (net_id);


--
-- TOC entry 4232 (class 2606 OID 20120)
-- Name: nets_data pk_nets_data; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_data
    ADD CONSTRAINT pk_nets_data PRIMARY KEY (net_id);


--
-- TOC entry 4234 (class 2606 OID 20122)
-- Name: nets_users_data pk_nets_users_data; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT pk_nets_users_data PRIMARY KEY (net_id, user_id);


--
-- TOC entry 4236 (class 2606 OID 20124)
-- Name: nodes pk_nodes; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT pk_nodes PRIMARY KEY (node_id);


--
-- TOC entry 4238 (class 2606 OID 20126)
-- Name: sessions pk_sessions; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT pk_sessions PRIMARY KEY (session_id);


--
-- TOC entry 4240 (class 2606 OID 20128)
-- Name: users pk_users; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT pk_users PRIMARY KEY (user_id);


--
-- TOC entry 4245 (class 2606 OID 20130)
-- Name: users_members pk_users_members; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_members
    ADD CONSTRAINT pk_users_members PRIMARY KEY (parent_node_id, user_id, member_id);


--
-- TOC entry 4247 (class 2606 OID 20132)
-- Name: users_nodes_invites pk_users_nodes_invites; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_nodes_invites
    ADD CONSTRAINT pk_users_nodes_invites PRIMARY KEY (node_id);


--
-- TOC entry 4250 (class 2606 OID 20134)
-- Name: users_tokens pk_users_tokens; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT pk_users_tokens PRIMARY KEY (user_id);


--
-- TOC entry 4242 (class 2606 OID 20136)
-- Name: users uk_email; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_email UNIQUE (email);


--
-- TOC entry 4230 (class 2606 OID 20138)
-- Name: nets uk_nets_node; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets
    ADD CONSTRAINT uk_nets_node UNIQUE (node_id);


--
-- TOC entry 4243 (class 1259 OID 20139)
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- TOC entry 4248 (class 1259 OID 20140)
-- Name: users_nodes_invites_token_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX users_nodes_invites_token_idx ON public.users_nodes_invites USING btree (token);


--
-- TOC entry 4252 (class 2606 OID 20141)
-- Name: nets_data fk_nets_data_net; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_data
    ADD CONSTRAINT fk_nets_data_net FOREIGN KEY (net_id) REFERENCES public.nets(net_id) ON DELETE CASCADE;


--
-- TOC entry 4251 (class 2606 OID 20146)
-- Name: nets fk_nets_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets
    ADD CONSTRAINT fk_nets_node FOREIGN KEY (node_id) REFERENCES public.nodes(node_id);


--
-- TOC entry 4253 (class 2606 OID 20151)
-- Name: nets_users_data fk_nets_users_data_net; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT fk_nets_users_data_net FOREIGN KEY (net_id) REFERENCES public.nets(net_id);


--
-- TOC entry 4254 (class 2606 OID 20156)
-- Name: nets_users_data fk_nets_users_data_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT fk_nets_users_data_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4255 (class 2606 OID 20161)
-- Name: nodes fk_nodes_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT fk_nodes_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4256 (class 2606 OID 20166)
-- Name: users_members fk_users_members_member; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_members
    ADD CONSTRAINT fk_users_members_member FOREIGN KEY (member_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4257 (class 2606 OID 20171)
-- Name: users_members fk_users_members_parent_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_members
    ADD CONSTRAINT fk_users_members_parent_node FOREIGN KEY (parent_node_id) REFERENCES public.nodes(node_id);


--
-- TOC entry 4258 (class 2606 OID 20176)
-- Name: users_members fk_users_members_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_members
    ADD CONSTRAINT fk_users_members_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4259 (class 2606 OID 20181)
-- Name: users_nodes_invites fk_users_nodes_invites_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_nodes_invites
    ADD CONSTRAINT fk_users_nodes_invites_node FOREIGN KEY (node_id) REFERENCES public.nodes(node_id);


--
-- TOC entry 4260 (class 2606 OID 20186)
-- Name: users_nodes_invites fk_users_nodes_invites_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_nodes_invites
    ADD CONSTRAINT fk_users_nodes_invites_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4261 (class 2606 OID 20191)
-- Name: users_tokens fk_users_tokens_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT fk_users_tokens_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2022-12-30 22:44:15 EET

--
-- PostgreSQL database dump complete
--

