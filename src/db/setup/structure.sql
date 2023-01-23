--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

-- Started on 2023-01-23 11:48:27

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
-- TOC entry 209 (class 1259 OID 34356)
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
-- TOC entry 210 (class 1259 OID 34361)
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
-- TOC entry 211 (class 1259 OID 34369)
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
-- TOC entry 212 (class 1259 OID 34376)
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
-- TOC entry 213 (class 1259 OID 34383)
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
-- TOC entry 214 (class 1259 OID 34390)
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
-- TOC entry 215 (class 1259 OID 34393)
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
-- TOC entry 216 (class 1259 OID 34394)
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
-- TOC entry 217 (class 1259 OID 34400)
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
-- TOC entry 218 (class 1259 OID 34401)
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
-- TOC entry 219 (class 1259 OID 34408)
-- Name: users_changes; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users_changes (
    user_id bigint NOT NULL,
    date timestamp without time zone NOT NULL
);


ALTER TABLE public.users_changes OWNER TO merega;

--
-- TOC entry 220 (class 1259 OID 34411)
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
-- TOC entry 221 (class 1259 OID 34416)
-- Name: users_messages; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users_messages (
    message_id bigint NOT NULL,
    user_node_id bigint NOT NULL,
    net_view character(10) NOT NULL,
    member_node_id bigint,
    message character varying(255) NOT NULL,
    date timestamp without time zone NOT NULL
);


ALTER TABLE public.users_messages OWNER TO merega;

--
-- TOC entry 222 (class 1259 OID 34419)
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
-- TOC entry 223 (class 1259 OID 34420)
-- Name: users_messages_tmp; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users_messages_tmp (
    original_user_node_id bigint NOT NULL,
    user_node_id bigint NOT NULL,
    net_view character(10) NOT NULL,
    member_node_id bigint,
    message character varying(255) NOT NULL,
    date timestamp without time zone NOT NULL
);


ALTER TABLE public.users_messages_tmp OWNER TO merega;

--
-- TOC entry 224 (class 1259 OID 34423)
-- Name: users_tokens; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users_tokens (
    user_id bigint NOT NULL,
    token character varying(255) NOT NULL
);


ALTER TABLE public.users_tokens OWNER TO merega;

--
-- TOC entry 225 (class 1259 OID 34426)
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
-- TOC entry 3240 (class 2606 OID 34428)
-- Name: nets pk_nets; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets
    ADD CONSTRAINT pk_nets PRIMARY KEY (net_node_id);


--
-- TOC entry 3242 (class 2606 OID 34430)
-- Name: nets_data pk_nets_data; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_data
    ADD CONSTRAINT pk_nets_data PRIMARY KEY (net_node_id);


--
-- TOC entry 3244 (class 2606 OID 34432)
-- Name: nets_users_data pk_nets_users_data; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT pk_nets_users_data PRIMARY KEY (node_id);


--
-- TOC entry 3248 (class 2606 OID 34434)
-- Name: nets_users_data_tmp pk_nets_users_data_tmp; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data_tmp
    ADD CONSTRAINT pk_nets_users_data_tmp PRIMARY KEY (user_id, net_node_id);


--
-- TOC entry 3250 (class 2606 OID 34436)
-- Name: nodes pk_nodes; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT pk_nodes PRIMARY KEY (node_id);


--
-- TOC entry 3261 (class 2606 OID 34438)
-- Name: sessions pk_sessions; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT pk_sessions PRIMARY KEY (session_id);


--
-- TOC entry 3263 (class 2606 OID 34440)
-- Name: users pk_users; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT pk_users PRIMARY KEY (user_id);


--
-- TOC entry 3268 (class 2606 OID 34442)
-- Name: users_changes pk_users_changes; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_changes
    ADD CONSTRAINT pk_users_changes PRIMARY KEY (user_id);


--
-- TOC entry 3270 (class 2606 OID 34444)
-- Name: users_members pk_users_members; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_members
    ADD CONSTRAINT pk_users_members PRIMARY KEY (parent_node_id, user_id, member_id);


--
-- TOC entry 3272 (class 2606 OID 34446)
-- Name: users_messages pk_users_messages; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_messages
    ADD CONSTRAINT pk_users_messages PRIMARY KEY (message_id);


--
-- TOC entry 3256 (class 2606 OID 34448)
-- Name: nodes_invites pk_users_nodes_invites; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_invites
    ADD CONSTRAINT pk_users_nodes_invites PRIMARY KEY (node_id);


--
-- TOC entry 3276 (class 2606 OID 34450)
-- Name: users_tokens pk_users_tokens; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT pk_users_tokens PRIMARY KEY (user_id);


--
-- TOC entry 3265 (class 2606 OID 34452)
-- Name: users uk_email; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_email UNIQUE (email);


--
-- TOC entry 3246 (class 2606 OID 34454)
-- Name: nets_users_data uk_nets_users_data_user_net_node; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT uk_nets_users_data_user_net_node UNIQUE (user_id, net_node_id);


--
-- TOC entry 3252 (class 2606 OID 34456)
-- Name: nodes uk_nodes_node_net_node; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT uk_nodes_node_net_node UNIQUE (node_id, net_node_id);


--
-- TOC entry 3254 (class 2606 OID 34458)
-- Name: nodes uk_nodes_node_parent_node; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT uk_nodes_node_parent_node UNIQUE (node_id, parent_node_id);


--
-- TOC entry 3258 (class 2606 OID 34460)
-- Name: nodes_invites uk_users_nodes_invites_token; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_invites
    ADD CONSTRAINT uk_users_nodes_invites_token UNIQUE (token);


--
-- TOC entry 3278 (class 2606 OID 34462)
-- Name: users_tokens uk_users_tokens_token; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT uk_users_tokens_token UNIQUE (token);


--
-- TOC entry 3274 (class 1259 OID 34463)
-- Name: sk_users_messages_original_user_node; Type: INDEX; Schema: public; Owner: merega
--

CREATE INDEX sk_users_messages_original_user_node ON public.users_messages_tmp USING btree (original_user_node_id);


--
-- TOC entry 3273 (class 1259 OID 34464)
-- Name: sk_users_messages_user_node; Type: INDEX; Schema: public; Owner: merega
--

CREATE INDEX sk_users_messages_user_node ON public.users_messages USING btree (user_node_id);


--
-- TOC entry 3266 (class 1259 OID 34465)
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- TOC entry 3259 (class 1259 OID 34466)
-- Name: users_nodes_invites_token_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX users_nodes_invites_token_idx ON public.nodes_invites USING btree (token);


--
-- TOC entry 3279 (class 1259 OID 34467)
-- Name: users_tokens_token_idx; Type: INDEX; Schema: public; Owner: merega
--

CREATE UNIQUE INDEX users_tokens_token_idx ON public.users_tokens USING btree (token);


--
-- TOC entry 3281 (class 2606 OID 34468)
-- Name: nets_data fk_nets_data_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_data
    ADD CONSTRAINT fk_nets_data_node FOREIGN KEY (net_node_id) REFERENCES public.nodes(node_id) ON DELETE CASCADE;


--
-- TOC entry 3280 (class 2606 OID 34473)
-- Name: nets fk_nets_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets
    ADD CONSTRAINT fk_nets_node FOREIGN KEY (net_node_id) REFERENCES public.nodes(node_id) ON DELETE CASCADE;


--
-- TOC entry 3282 (class 2606 OID 34478)
-- Name: nets_users_data fk_nets_users_data_node_net_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT fk_nets_users_data_node_net_node FOREIGN KEY (node_id, net_node_id) REFERENCES public.nodes(node_id, net_node_id) ON UPDATE CASCADE;


--
-- TOC entry 3283 (class 2606 OID 34483)
-- Name: nets_users_data fk_nets_users_data_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT fk_nets_users_data_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3284 (class 2606 OID 34488)
-- Name: nodes_invites fk_nodes_invites_node_parent_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_invites
    ADD CONSTRAINT fk_nodes_invites_node_parent_node FOREIGN KEY (node_id, parent_node_id) REFERENCES public.nodes(node_id, parent_node_id) ON UPDATE CASCADE;


--
-- TOC entry 3285 (class 2606 OID 34493)
-- Name: nodes_invites fk_nodes_invites_parent_user_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_invites
    ADD CONSTRAINT fk_nodes_invites_parent_user_node FOREIGN KEY (parent_node_id) REFERENCES public.nets_users_data(node_id) ON DELETE CASCADE;


--
-- TOC entry 3286 (class 2606 OID 34498)
-- Name: sessions fk_sessions_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3287 (class 2606 OID 34503)
-- Name: users_changes fk_users_changes_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_changes
    ADD CONSTRAINT fk_users_changes_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3288 (class 2606 OID 34508)
-- Name: users_members fk_users_members_member; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_members
    ADD CONSTRAINT fk_users_members_member FOREIGN KEY (member_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3289 (class 2606 OID 34513)
-- Name: users_members fk_users_members_parent_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_members
    ADD CONSTRAINT fk_users_members_parent_node FOREIGN KEY (parent_node_id) REFERENCES public.nodes(node_id);


--
-- TOC entry 3290 (class 2606 OID 34518)
-- Name: users_members fk_users_members_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_members
    ADD CONSTRAINT fk_users_members_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3291 (class 2606 OID 34523)
-- Name: users_messages fk_users_messages_member_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_messages
    ADD CONSTRAINT fk_users_messages_member_node FOREIGN KEY (member_node_id) REFERENCES public.nodes(node_id) ON DELETE CASCADE;


--
-- TOC entry 3292 (class 2606 OID 34528)
-- Name: users_messages fk_users_messages_user_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_messages
    ADD CONSTRAINT fk_users_messages_user_node FOREIGN KEY (user_node_id) REFERENCES public.nets_users_data(node_id) ON DELETE CASCADE;


--
-- TOC entry 3293 (class 2606 OID 34533)
-- Name: users_tokens fk_users_tokens_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT fk_users_tokens_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2023-01-23 11:48:27

--
-- PostgreSQL database dump complete
--

