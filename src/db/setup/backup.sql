--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

-- Started on 2022-12-23 15:12:14

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
-- TOC entry 3401 (class 1262 OID 27032)
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
-- TOC entry 209 (class 1259 OID 27033)
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
-- TOC entry 210 (class 1259 OID 27038)
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
-- TOC entry 211 (class 1259 OID 27046)
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
-- TOC entry 212 (class 1259 OID 27047)
-- Name: nets_users_data; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nets_users_data (
    net_id bigint NOT NULL,
    user_id bigint NOT NULL,
    email_show bit(1) DEFAULT '0'::"bit" NOT NULL,
    name_show bit(1) DEFAULT '0'::"bit" NOT NULL,
    mobile_show bit(1) DEFAULT '0'::"bit" NOT NULL
);


ALTER TABLE public.nets_users_data OWNER TO merega;

--
-- TOC entry 213 (class 1259 OID 27053)
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
    blocked bit(1) DEFAULT '0'::"bit" NOT NULL,
    changes bit(1) DEFAULT '0'::"bit" NOT NULL,
    user_id bigint
);


ALTER TABLE public.nodes OWNER TO merega;

--
-- TOC entry 214 (class 1259 OID 27061)
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
-- TOC entry 215 (class 1259 OID 27062)
-- Name: sessions; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.sessions (
    session_id bigint NOT NULL,
    session_key character varying(255) NOT NULL,
    session_value character varying(255) NOT NULL
);


ALTER TABLE public.sessions OWNER TO merega;

--
-- TOC entry 216 (class 1259 OID 27067)
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
-- TOC entry 217 (class 1259 OID 27068)
-- Name: users; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users (
    user_id bigint NOT NULL,
    email character varying(50) NOT NULL,
    name character varying(50) DEFAULT NULL::character varying,
    mobile character varying(255) DEFAULT NULL::character varying,
    password character varying(255) DEFAULT NULL::character varying,
    net_name character varying(50) DEFAULT NULL::character varying
);


ALTER TABLE public.users OWNER TO merega;

--
-- TOC entry 218 (class 1259 OID 27077)
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
-- TOC entry 219 (class 1259 OID 27080)
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
-- TOC entry 220 (class 1259 OID 27087)
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
-- TOC entry 3384 (class 0 OID 27033)
-- Dependencies: 209
-- Data for Name: nets; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets (net_id, net_level, parent_net_id, first_net_id, count_of_nets, node_id) FROM stdin;
1	0	\N	1	1	1
\.


--
-- TOC entry 3385 (class 0 OID 27038)
-- Dependencies: 210
-- Data for Name: nets_data; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets_data (net_id, name, goal, resource_name, resource_link) FROM stdin;
1	My net	\N	\N	\N
\.


--
-- TOC entry 3387 (class 0 OID 27047)
-- Dependencies: 212
-- Data for Name: nets_users_data; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets_users_data (net_id, user_id, email_show, name_show, mobile_show) FROM stdin;
1	1	0	0	0
1	2	0	0	0
\.


--
-- TOC entry 3388 (class 0 OID 27053)
-- Dependencies: 213
-- Data for Name: nodes; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nodes (node_id, node_level, node_position, parent_node_id, first_node_id, count_of_members, node_date, blocked, changes, user_id) FROM stdin;
2	1	1	1	1	0	2022-12-23 09:01:11.182	0	0	\N
3	1	2	1	1	0	2022-12-23 09:01:11.182	0	0	\N
5	1	4	1	1	0	2022-12-23 09:01:11.182	0	0	\N
6	1	5	1	1	0	2022-12-23 09:01:11.182	0	0	\N
7	1	6	1	1	0	2022-12-23 09:01:11.182	0	0	\N
4	1	3	1	1	1	2022-12-23 09:01:11.182	0	0	2
1	0	0	\N	1	2	2022-12-23 09:01:11.175	0	0	1
20	2	1	4	1	0	2022-12-23 12:22:22.216	0	0	\N
21	2	2	4	1	0	2022-12-23 12:22:22.216	0	0	\N
22	2	3	4	1	0	2022-12-23 12:22:22.216	0	0	\N
23	2	4	4	1	0	2022-12-23 12:22:22.216	0	0	\N
24	2	5	4	1	0	2022-12-23 12:22:22.216	0	0	\N
25	2	6	4	1	0	2022-12-23 12:22:22.216	0	0	\N
\.


--
-- TOC entry 3390 (class 0 OID 27062)
-- Dependencies: 215
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.sessions (session_id, session_key, session_value) FROM stdin;
\.


--
-- TOC entry 3392 (class 0 OID 27068)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users (user_id, email, name, mobile, password, net_name) FROM stdin;
1	user01@gmail.com	\N	\N	062008617181fc63baa8e2cf381654c1:fb102bfe8ef9cb72518597626fe1d2f042cd56c71a90d6f84445a448ecc7474ca2d731181f10ff5a46b9cdcb03470990a9c26bfb2ecbf41b2d6a4100f4e415de	\N
2	user02@gmail.com	\N	\N	eb9942a2e903893f0c4c41e90698b613:b6be1a04478eaa85e7938e6d5ff9d3ff6ce3c5e90cc538ac0ef2ed380cb3c695765f364000cb582a5c5b62b05d249673366c4ba838c86d51036d216fdc7acc0b	\N
\.


--
-- TOC entry 3393 (class 0 OID 27077)
-- Dependencies: 218
-- Data for Name: users_nodes_invites; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users_nodes_invites (node_id, user_id, member_name, token) FROM stdin;
\.


--
-- TOC entry 3394 (class 0 OID 27080)
-- Dependencies: 219
-- Data for Name: users_tokens; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users_tokens (user_id, confirm_token, invite_token, restore_token) FROM stdin;
1	\N	\N	\N
2	\N	\N	\N
\.


--
-- TOC entry 3402 (class 0 OID 0)
-- Dependencies: 211
-- Name: nets_net_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.nets_net_id_seq', 1, true);


--
-- TOC entry 3403 (class 0 OID 0)
-- Dependencies: 214
-- Name: nodes_node_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.nodes_node_id_seq', 25, true);


--
-- TOC entry 3404 (class 0 OID 0)
-- Dependencies: 216
-- Name: sessions_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.sessions_session_id_seq', 11, true);


--
-- TOC entry 3405 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.users_user_id_seq', 2, true);


--
-- TOC entry 3215 (class 2606 OID 27089)
-- Name: nets pk_nets; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets
    ADD CONSTRAINT pk_nets PRIMARY KEY (net_id);


--
-- TOC entry 3219 (class 2606 OID 27091)
-- Name: nets_data pk_nets_data; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_data
    ADD CONSTRAINT pk_nets_data PRIMARY KEY (net_id);


--
-- TOC entry 3221 (class 2606 OID 27093)
-- Name: nets_users_data pk_nets_users_data; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT pk_nets_users_data PRIMARY KEY (net_id, user_id);


--
-- TOC entry 3223 (class 2606 OID 27095)
-- Name: nodes pk_nodes; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT pk_nodes PRIMARY KEY (node_id);


--
-- TOC entry 3225 (class 2606 OID 27097)
-- Name: sessions pk_sessions; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT pk_sessions PRIMARY KEY (session_id);


--
-- TOC entry 3227 (class 2606 OID 27099)
-- Name: users pk_users; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT pk_users PRIMARY KEY (user_id);


--
-- TOC entry 3232 (class 2606 OID 27101)
-- Name: users_nodes_invites pk_users_nodes_invites; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_nodes_invites
    ADD CONSTRAINT pk_users_nodes_invites PRIMARY KEY (node_id);


--
-- TOC entry 3236 (class 2606 OID 27103)
-- Name: users_tokens pk_users_tokens; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT pk_users_tokens PRIMARY KEY (user_id);


--
-- TOC entry 3229 (class 2606 OID 27105)
-- Name: users uk_email; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_email UNIQUE (email);


--
-- TOC entry 3217 (class 2606 OID 27107)
-- Name: nets uk_nets_node; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets
    ADD CONSTRAINT uk_nets_node UNIQUE (node_id);


--
-- TOC entry 3234 (class 2606 OID 27109)
-- Name: users_nodes_invites uk_users_nodes_invites_token; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_nodes_invites
    ADD CONSTRAINT uk_users_nodes_invites_token UNIQUE (token);


--
-- TOC entry 3230 (class 1259 OID 27110)
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- TOC entry 3238 (class 2606 OID 27111)
-- Name: nets_data fk_nets_data_net; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_data
    ADD CONSTRAINT fk_nets_data_net FOREIGN KEY (net_id) REFERENCES public.nets(net_id) ON DELETE CASCADE;


--
-- TOC entry 3237 (class 2606 OID 27116)
-- Name: nets fk_nets_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets
    ADD CONSTRAINT fk_nets_node FOREIGN KEY (node_id) REFERENCES public.nodes(node_id);


--
-- TOC entry 3239 (class 2606 OID 27121)
-- Name: nets_users_data fk_nets_users_data_net; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT fk_nets_users_data_net FOREIGN KEY (net_id) REFERENCES public.nets(net_id);


--
-- TOC entry 3240 (class 2606 OID 27126)
-- Name: nets_users_data fk_nets_users_data_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT fk_nets_users_data_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3241 (class 2606 OID 27131)
-- Name: nodes fk_nodes_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT fk_nodes_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 3242 (class 2606 OID 27136)
-- Name: users_nodes_invites fk_users_nodes_invites_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_nodes_invites
    ADD CONSTRAINT fk_users_nodes_invites_node FOREIGN KEY (node_id) REFERENCES public.nodes(node_id);


--
-- TOC entry 3243 (class 2606 OID 27141)
-- Name: users_nodes_invites fk_users_nodes_invites_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_nodes_invites
    ADD CONSTRAINT fk_users_nodes_invites_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 3244 (class 2606 OID 27146)
-- Name: users_tokens fk_users_tokens_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT fk_users_tokens_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2022-12-23 15:12:14

--
-- PostgreSQL database dump complete
--

