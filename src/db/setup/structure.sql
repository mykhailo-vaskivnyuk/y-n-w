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
-- Name: board_messages; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.board_messages (
    message_id bigint NOT NULL,
    net_id bigint NOT NULL,
    user_id bigint NOT NULL,
    node_id bigint NOT NULL,
    net_view character(10) DEFAULT 'net'::bpchar,
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
    user_node_id bigint,
    net_view character(10) NOT NULL,
    member_node_id bigint,
    message character varying(255) NOT NULL,
    date timestamp without time zone NOT NULL
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
-- Name: events_tmp; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.events_tmp (
    event_id bigint NOT NULL,
    user_id bigint NOT NULL,
    user_node_id bigint NOT NULL,
    net_view character(10) NOT NULL,
    member_node_id bigint,
    message character varying(255) NOT NULL,
    date timestamp without time zone NOT NULL
);


ALTER TABLE public.events_tmp OWNER TO merega;

--
-- Name: members; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.members (
    member_id bigint NOT NULL,
    node_id bigint NOT NULL,
    net_id bigint NOT NULL,
    user_id bigint NOT NULL,
    email_show boolean DEFAULT false NOT NULL,
    name_show boolean DEFAULT false NOT NULL,
    mobile_show boolean DEFAULT false NOT NULL,
    confirmed boolean DEFAULT false NOT NULL,
    active_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.members OWNER TO merega;

--
-- Name: members_member_id_seq; Type: SEQUENCE; Schema: public; Owner: merega
--

ALTER TABLE public.members ALTER COLUMN member_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.members_member_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: members_tmp; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.members_tmp (
    member_id bigint NOT NULL,
    node_id bigint NOT NULL,
    net_id bigint NOT NULL,
    user_id bigint NOT NULL,
    email_show boolean NOT NULL,
    name_show boolean NOT NULL,
    mobile_show boolean NOT NULL,
    confirmed boolean NOT NULL,
    active_date timestamp without time zone NOT NULL
);


ALTER TABLE public.members_tmp OWNER TO merega;

--
-- Name: nets; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nets (
    net_id bigint NOT NULL,
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
    net_id bigint NOT NULL,
    name character varying(50) NOT NULL,
    goal text DEFAULT NULL::character varying,
    resource_name character varying(50) DEFAULT NULL::character varying,
    resource_link character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.nets_data OWNER TO merega;

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
    node_position integer DEFAULT 0 NOT NULL,
    parent_node_id bigint,
    net_id bigint NOT NULL,
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
-- Name: events_tmp pk_events_tmp; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.events_tmp
    ADD CONSTRAINT pk_events_tmp PRIMARY KEY (event_id);


--
-- Name: members pk_members; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT pk_members PRIMARY KEY (member_id);


--
-- Name: members_tmp pk_members_tmp; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members_tmp
    ADD CONSTRAINT pk_members_tmp PRIMARY KEY (member_id);


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
-- Name: members uk_members_node; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT uk_members_node UNIQUE (node_id);


--
-- Name: members uk_members_user_net; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT uk_members_user_net UNIQUE (user_id, net_id);


--
-- Name: nodes uk_nodes_node_net; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT uk_nodes_node_net UNIQUE (node_id, net_id);


--
-- Name: nodes uk_nodes_node_parent_node; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT uk_nodes_node_parent_node UNIQUE (node_id, parent_node_id);


--
-- Name: board_messages uk_users_board_mesages_user_net; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.board_messages
    ADD CONSTRAINT uk_users_board_mesages_user_net UNIQUE (user_id, net_id);


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
-- Name: sk_board_messages_net; Type: INDEX; Schema: public; Owner: merega
--

CREATE INDEX sk_board_messages_net ON public.board_messages USING btree (net_id);


--
-- Name: sk_events_tmp_user; Type: INDEX; Schema: public; Owner: merega
--

CREATE INDEX sk_events_tmp_user ON public.events_tmp USING btree (user_id);


--
-- Name: sk_events_user; Type: INDEX; Schema: public; Owner: merega
--

CREATE INDEX sk_events_user ON public.events USING btree (user_id);


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
-- Name: board_messages fk_board_messages_node_net; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.board_messages
    ADD CONSTRAINT fk_board_messages_node_net FOREIGN KEY (node_id, net_id) REFERENCES public.nodes(node_id, net_id) ON DELETE CASCADE;


--
-- Name: events fk_events_member_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_events_member_node FOREIGN KEY (member_node_id) REFERENCES public.nodes(node_id) ON DELETE CASCADE;


--
-- Name: events fk_events_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_events_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: events fk_events_user_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_events_user_node FOREIGN KEY (user_node_id) REFERENCES public.members(node_id) ON DELETE SET NULL;


--
-- Name: members fk_members_node_net; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT fk_members_node_net FOREIGN KEY (node_id, net_id) REFERENCES public.nodes(node_id, net_id);


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
-- Name: nodes_invites fk_nodes_invites_node_parent_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_invites
    ADD CONSTRAINT fk_nodes_invites_node_parent_node FOREIGN KEY (node_id, parent_node_id) REFERENCES public.nodes(node_id, parent_node_id) ON UPDATE CASCADE;


--
-- Name: nodes_invites fk_nodes_invites_parent_user_node; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_invites
    ADD CONSTRAINT fk_nodes_invites_parent_user_node FOREIGN KEY (parent_node_id) REFERENCES public.members(node_id) ON DELETE CASCADE;


--
-- Name: nodes fk_nodes_net; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT fk_nodes_net FOREIGN KEY (net_id) REFERENCES public.nets(net_id) ON DELETE CASCADE;


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
-- Name: users_tokens fk_users_tokens_user; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT fk_users_tokens_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

