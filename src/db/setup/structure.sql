--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

-- Started on 2022-11-14 02:45:38

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

--DROP DATABASE merega;
--
-- TOC entry 3405 (class 1262 OID 43864)
-- Name: merega; Type: DATABASE; Schema: -; Owner: merega
--

--CREATE DATABASE merega WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


--ALTER DATABASE merega OWNER TO merega;

--\connect merega

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
-- TOC entry 209 (class 1259 OID 43865)
-- Name: nets; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nets (
    net_id bigint NOT NULL,
    net_level integer,
    net_address integer,
    parent_net_id integer,
    first_net_id integer,
    full_net_address integer,
    count_of_nets integer
);


ALTER TABLE public.nets OWNER TO merega;

--
-- TOC entry 210 (class 1259 OID 43870)
-- Name: nets_data; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nets_data (
    net_id bigint NOT NULL,
    name character varying(50) DEFAULT NULL::character varying,
    goal text,
    resource_name_1 character varying(50) DEFAULT NULL::character varying,
    resource_link_1 character varying(255) DEFAULT NULL::character varying,
    resource_name_2 character varying(50) DEFAULT NULL::character varying,
    resource_link_2 character varying(255) DEFAULT NULL::character varying,
    resource_name_3 character varying(50) DEFAULT NULL::character varying,
    resource_link_3 character varying(255) DEFAULT NULL::character varying,
    resource_name_4 character varying(50) DEFAULT NULL::character varying,
    resource_link_4 character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.nets_data OWNER TO merega;

--
-- TOC entry 217 (class 1259 OID 43969)
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
-- TOC entry 211 (class 1259 OID 43884)
-- Name: nets_users_data; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nets_users_data (
    net_id bigint NOT NULL,
    user_id bigint NOT NULL,
    email_show bit(1) DEFAULT '0'::"bit",
    name_show bit(1) DEFAULT '0'::"bit",
    mobile_show bit(1) DEFAULT '0'::"bit"
);


ALTER TABLE public.nets_users_data OWNER TO merega;

--
-- TOC entry 212 (class 1259 OID 43890)
-- Name: nodes; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nodes (
    node_id bigint NOT NULL,
    node_level integer,
    node_address integer,
    parent_node_id integer,
    first_node_id integer,
    full_node_address integer,
    count_of_members integer,
    node_date timestamp without time zone,
    blocked bit(1) DEFAULT NULL::"bit",
    changes bit(1) DEFAULT NULL::"bit"
);


ALTER TABLE public.nodes OWNER TO merega;

--
-- TOC entry 213 (class 1259 OID 43897)
-- Name: nodes_nets; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nodes_nets (
    node_id bigint NOT NULL,
    net_id bigint NOT NULL
);


ALTER TABLE public.nodes_nets OWNER TO merega;

--
-- TOC entry 218 (class 1259 OID 43974)
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
-- TOC entry 214 (class 1259 OID 43900)
-- Name: nodes_users; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nodes_users (
    node_id bigint NOT NULL,
    user_id bigint NOT NULL,
    invite character varying(255) DEFAULT NULL::character varying,
    old_list_name character varying(50) DEFAULT NULL::character varying,
    old_list_note character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.nodes_users OWNER TO merega;

--
-- TOC entry 215 (class 1259 OID 43908)
-- Name: sessions; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.sessions (
    session_id bigint NOT NULL,
    session_key character varying(255) NOT NULL,
    session_value character varying(255) NOT NULL
);


ALTER TABLE public.sessions OWNER TO merega;

--
-- TOC entry 219 (class 1259 OID 43979)
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
-- TOC entry 216 (class 1259 OID 43915)
-- Name: users; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users (
    user_id bigint NOT NULL,
    email character varying(50) NOT NULL,
    name character varying(50) DEFAULT NULL::character varying,
    mobile character varying(255) DEFAULT NULL::character varying,
    password character varying(255) DEFAULT NULL::character varying,
    link character varying(255) DEFAULT NULL::character varying,
    invite character varying(255) DEFAULT NULL::character varying,
    restore character varying(255) DEFAULT NULL::character varying,
    net_name character varying(50) DEFAULT NULL::character varying
);


ALTER TABLE public.users OWNER TO merega;

--
-- TOC entry 220 (class 1259 OID 43980)
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
-- TOC entry 3220 (class 2606 OID 43869)
-- Name: nets nets_pkey; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets
    ADD CONSTRAINT pkNets PRIMARY KEY (net_id);


--
-- TOC entry 3226 (class 2606 OID 43896)
-- Name: nodes nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT pkNodes PRIMARY KEY (node_id);


--
-- TOC entry 3236 (class 2606 OID 43914)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT pkSessions PRIMARY KEY (session_id);


--
-- TOC entry 3238 (class 2606 OID 43982)
-- Name: users ukEmail; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "ukEmail" UNIQUE (email);


--
-- TOC entry 3222 (class 2606 OID 43971)
-- Name: nets_data ukNet; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_data
    ADD CONSTRAINT "ukNet" UNIQUE (net_id);


--
-- TOC entry 3224 (class 2606 OID 43973)
-- Name: nets_users_data ukNetUser; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT "ukNetUser" UNIQUE (net_id, user_id);


--
-- TOC entry 3230 (class 2606 OID 43976)
-- Name: nodes_nets ukNodeNets; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_nets
    ADD CONSTRAINT "ukNodeNets" UNIQUE (node_id);


--
-- TOC entry 3234 (class 2606 OID 43978)
-- Name: nodes_users ukNodeUsers; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_users
    ADD CONSTRAINT "ukNodeUsers" UNIQUE (node_id);


--
-- TOC entry 3241 (class 2606 OID 43928)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT pkUsers PRIMARY KEY (user_id);


--
-- TOC entry 3227 (class 1259 OID 43929)
-- Name: nodes_nets_node_id_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX nodes_nets_node_id_idx ON public.nodes_nets USING btree (node_id);


--
-- TOC entry 3231 (class 1259 OID 43931)
-- Name: nodes_users_node_id_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX nodes_users_node_id_idx ON public.nodes_users USING btree (node_id);


--
-- TOC entry 3228 (class 1259 OID 43930)
-- Name: ukNodeNet; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX "ukNodeNet" ON public.nodes_nets USING btree (node_id, net_id);


--
-- TOC entry 3232 (class 1259 OID 43932)
-- Name: ukNodeUser; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX "ukNodeUser" ON public.nodes_users USING btree (node_id, user_id);


--
-- TOC entry 3239 (class 1259 OID 43933)
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- TOC entry 3242 (class 2606 OID 43934)
-- Name: nets_data fkNetsDataNet; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_data
    ADD CONSTRAINT "fkNetsDataNet" FOREIGN KEY (net_id) REFERENCES public.nets(net_id) ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3243 (class 2606 OID 43939)
-- Name: nets_users_data fkNetsUsersDataNet; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT "fkNetsUsersDataNet" FOREIGN KEY (net_id) REFERENCES public.nets(net_id) ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3244 (class 2606 OID 43944)
-- Name: nets_users_data fkNetsUsersDataUser; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT "fkNetsUsersDataUser" FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3246 (class 2606 OID 43954)
-- Name: nodes_nets fkNodesNetsNet; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_nets
    ADD CONSTRAINT "fkNodesNetsNet" FOREIGN KEY (net_id) REFERENCES public.nets(net_id) ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3245 (class 2606 OID 43949)
-- Name: nodes_nets fkNodesNetsNode; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_nets
    ADD CONSTRAINT "fkNodesNetsNode" FOREIGN KEY (node_id) REFERENCES public.nodes(node_id) ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3247 (class 2606 OID 43959)
-- Name: nodes_users fkNodesUsersNode; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_users
    ADD CONSTRAINT "fkNodesUsersNode" FOREIGN KEY (node_id) REFERENCES public.nodes(node_id) ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3248 (class 2606 OID 43964)
-- Name: nodes_users fkNodesUsersUser; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_users
    ADD CONSTRAINT "fkNodesUsersUser" FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE NOT VALID;


-- Completed on 2022-11-14 02:45:39

--
-- PostgreSQL database dump complete
--

