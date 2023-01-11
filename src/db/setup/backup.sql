--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

-- Started on 2023-01-11 15:11:22

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
-- TOC entry 209 (class 1259 OID 34008)
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
-- TOC entry 210 (class 1259 OID 34013)
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
-- TOC entry 211 (class 1259 OID 34021)
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
-- TOC entry 212 (class 1259 OID 34028)
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
-- TOC entry 213 (class 1259 OID 34035)
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
-- TOC entry 214 (class 1259 OID 34042)
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
-- TOC entry 215 (class 1259 OID 34045)
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
-- TOC entry 216 (class 1259 OID 34046)
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
-- TOC entry 217 (class 1259 OID 34052)
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
-- TOC entry 218 (class 1259 OID 34053)
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
-- TOC entry 219 (class 1259 OID 34060)
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
-- TOC entry 220 (class 1259 OID 34065)
-- Name: users_tokens; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users_tokens (
    user_id bigint NOT NULL,
    token character varying(255) NOT NULL
);


ALTER TABLE public.users_tokens OWNER TO merega;

--
-- TOC entry 221 (class 1259 OID 34068)
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
-- TOC entry 3411 (class 0 OID 34008)
-- Dependencies: 209
-- Data for Name: nets; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets (net_node_id, net_level, parent_net_id, first_net_id, count_of_nets) FROM stdin;
1	0	\N	1	1
\.


--
-- TOC entry 3412 (class 0 OID 34013)
-- Dependencies: 210
-- Data for Name: nets_data; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets_data (net_node_id, name, goal, resource_name, resource_link) FROM stdin;
1	My new network	\N	\N	\N
\.


--
-- TOC entry 3413 (class 0 OID 34021)
-- Dependencies: 211
-- Data for Name: nets_users_data; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets_users_data (node_id, net_node_id, user_id, email_show, name_show, mobile_show, confirmed) FROM stdin;
1	1	1	f	f	f	t
3	1	2	f	f	f	t
5	1	3	f	f	f	t
\.


--
-- TOC entry 3414 (class 0 OID 34028)
-- Dependencies: 212
-- Data for Name: nets_users_data_tmp; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nets_users_data_tmp (node_id, net_node_id, user_id, email_show, name_show, mobile_show, confirmed) FROM stdin;
\.


--
-- TOC entry 3415 (class 0 OID 34035)
-- Dependencies: 213
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
-- TOC entry 3416 (class 0 OID 34042)
-- Dependencies: 214
-- Data for Name: nodes_invites; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.nodes_invites (parent_node_id, node_id, member_name, token) FROM stdin;
\.


--
-- TOC entry 3418 (class 0 OID 34046)
-- Dependencies: 216
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.sessions (session_id, user_id, session_key, session_value, updated) FROM stdin;
\.


--
-- TOC entry 3420 (class 0 OID 34053)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users (user_id, email, name, mobile, password, confirmed) FROM stdin;
1	user01@gmail.com	\N	\N	ee5d3bb0f5f23cf735caea21a4321116:53be5841d206ea53f4aab75bbe1072dac00f203dcc812ca77c0fab776e566a6cb519348d4a2a9eeb26d549d46792e9fa70092254a1cbc4bb58df316662147fbb	t
2	user02@gmail.com	\N	\N	8317b53f9189781a5aec6b8c4d1fdd83:235c7d0fff5c8d74fa0de478da7b1269397f6f14cc81f9f1f1d04d96637cfc41de78a375e728eaf0ab985877c5fcfdf40becaf2a458f52c1f36eea5fb96ca9d3	t
3	user03@gmail.com	\N	\N	428505ea613e395075de8335d6c11f1a:801e1098928a65226c5ea0edb379c5bedfd81e07211b15b80ad5e48e4efc89bb2de79e038da105aaf70a19d59e318c0c45648b1f4c38a14fc1e8a6aadae3ba56	t
\.


--
-- TOC entry 3421 (class 0 OID 34060)
-- Dependencies: 219
-- Data for Name: users_members; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users_members (parent_node_id, user_id, member_id, dislike, vote) FROM stdin;
1	1	2	f	f
1	2	2	f	f
1	2	3	f	t
1	3	2	f	f
1	3	3	f	f
\.


--
-- TOC entry 3422 (class 0 OID 34065)
-- Dependencies: 220
-- Data for Name: users_tokens; Type: TABLE DATA; Schema: public; Owner: merega
--

COPY public.users_tokens (user_id, token) FROM stdin;
\.


--
-- TOC entry 3429 (class 0 OID 0)
-- Dependencies: 215
-- Name: nodes_node_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.nodes_node_id_seq', 19, true);


--
-- TOC entry 3430 (class 0 OID 0)
-- Dependencies: 217
-- Name: sessions_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.sessions_session_id_seq', 15, true);


--
-- TOC entry 3431 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: merega
--

SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);


--
-- TOC entry 3227 (class 2606 OID 34070)
-- Name: nets pk_nets; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets
    ADD CONSTRAINT pk_nets PRIMARY KEY (net_node_id);


--
-- TOC entry 3229 (class 2606 OID 34072)
-- Name: nets_data pk_nets_data; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_data
    ADD CONSTRAINT pk_nets_data PRIMARY KEY (net_node_id);


--
-- TOC entry 3231 (class 2606 OID 34074)
-- Name: nets_users_data pk_nets_users_data; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT pk_nets_users_data PRIMARY KEY (node_id);


--
-- TOC entry 3235 (class 2606 OID 34076)
-- Name: nets_users_data_tmp pk_nets_users_data_tmp; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data_tmp
    ADD CONSTRAINT pk_nets_users_data_tmp PRIMARY KEY (user_id, net_node_id);


--
-- TOC entry 3237 (class 2606 OID 34078)
-- Name: nodes pk_nodes; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT pk_nodes PRIMARY KEY (node_id);


--
-- TOC entry 3248 (class 2606 OID 34080)
-- Name: sessions pk_sessions; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT pk_sessions PRIMARY KEY (session_id);


--
-- TOC entry 3250 (class 2606 OID 34082)
-- Name: users pk_users; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT pk_users PRIMARY KEY (user_id);


--
-- TOC entry 3255 (class 2606 OID 34084)
-- Name: users_members pk_users_members; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_members
    ADD CONSTRAINT pk_users_members PRIMARY KEY (parent_node_id, user_id, member_id);


--
-- TOC entry 3243 (class 2606 OID 34086)
-- Name: nodes_invites pk_users_nodes_invites; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_invites
    ADD CONSTRAINT pk_users_nodes_invites PRIMARY KEY (node_id);


--
-- TOC entry 3257 (class 2606 OID 34088)
-- Name: users_tokens pk_users_tokens; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT pk_users_tokens PRIMARY KEY (user_id);


--
-- TOC entry 3252 (class 2606 OID 34090)
-- Name: users uk_email; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_email UNIQUE (email);


--
-- TOC entry 3233 (class 2606 OID 34092)
-- Name: nets_users_data uk_nets_users_data_user_net_node; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT uk_nets_users_data_user_net_node UNIQUE (user_id, net_node_id);


--
-- TOC entry 3239 (class 2606 OID 34094)
-- Name: nodes uk_nodes_node_net_node; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT uk_nodes_node_net_node UNIQUE (node_id, net_node_id);


--
-- TOC entry 3241 (class 2606 OID 34096)
-- Name: nodes uk_nodes_node_parent_node; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT uk_nodes_node_parent_node UNIQUE (node_id, parent_node_id);


--
-- TOC entry 3245 (class 2606 OID 34098)
-- Name: nodes_invites uk_users_nodes_invites_token; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_invites
    ADD CONSTRAINT uk_users_nodes_invites_token UNIQUE (token);


--
-- TOC entry 3259 (class 2606 OID 34100)
-- Name: users_tokens uk_users_tokens_token; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT uk_users_tokens_token UNIQUE (token);


--
-- TOC entry 3253 (class 1259 OID 34101)
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- TOC entry 3246 (class 1259 OID 34102)
-- Name: users_nodes_invites_token_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX users_nodes_invites_token_idx ON public.nodes_invites USING btree (token);


--
-- TOC entry 3260 (class 1259 OID 34103)
-- Name: users_tokens_token_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX users_tokens_token_idx ON public.users_tokens USING btree (token);


--
-- TOC entry 3262 (class 2606 OID 34104)
-- Name: nets_data fk_nets_data_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_data
    ADD CONSTRAINT fk_nets_data_node FOREIGN KEY (net_node_id) REFERENCES public.nodes(node_id) ON DELETE CASCADE;


--
-- TOC entry 3261 (class 2606 OID 34109)
-- Name: nets fk_nets_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets
    ADD CONSTRAINT fk_nets_node FOREIGN KEY (net_node_id) REFERENCES public.nodes(node_id) ON DELETE CASCADE;


--
-- TOC entry 3263 (class 2606 OID 34114)
-- Name: nets_users_data fk_nets_users_data_node_net_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT fk_nets_users_data_node_net_node FOREIGN KEY (node_id, net_node_id) REFERENCES public.nodes(node_id, net_node_id) ON UPDATE CASCADE;


--
-- TOC entry 3264 (class 2606 OID 34119)
-- Name: nets_users_data fk_nets_users_data_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT fk_nets_users_data_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3265 (class 2606 OID 34124)
-- Name: nodes_invites fk_nodes_invites_node_parent_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_invites
    ADD CONSTRAINT fk_nodes_invites_node_parent_node FOREIGN KEY (node_id, parent_node_id) REFERENCES public.nodes(node_id, parent_node_id) ON UPDATE CASCADE;


--
-- TOC entry 3266 (class 2606 OID 34129)
-- Name: nodes_invites fk_nodes_invites_parent_user_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_invites
    ADD CONSTRAINT fk_nodes_invites_parent_user_node FOREIGN KEY (parent_node_id) REFERENCES public.nets_users_data(node_id) ON DELETE CASCADE;


--
-- TOC entry 3267 (class 2606 OID 34134)
-- Name: sessions fk_sessions_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3268 (class 2606 OID 34139)
-- Name: users_members fk_users_members_member; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_members
    ADD CONSTRAINT fk_users_members_member FOREIGN KEY (member_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3269 (class 2606 OID 34144)
-- Name: users_members fk_users_members_parent_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_members
    ADD CONSTRAINT fk_users_members_parent_node FOREIGN KEY (parent_node_id) REFERENCES public.nodes(node_id);


--
-- TOC entry 3270 (class 2606 OID 34149)
-- Name: users_members fk_users_members_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_members
    ADD CONSTRAINT fk_users_members_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3271 (class 2606 OID 34154)
-- Name: users_tokens fk_users_tokens_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT fk_users_tokens_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2023-01-11 15:11:22

--
-- PostgreSQL database dump complete
--

