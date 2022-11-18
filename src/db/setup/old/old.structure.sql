--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

-- Started on 2022-11-13 21:08:37

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
-- TOC entry 3441 (class 1262 OID 34785)
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
-- TOC entry 210 (class 1259 OID 34787)
-- Name: members_users; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.members_users (
    net_id bigint NOT NULL,
    member_id bigint NOT NULL,
    user_id bigint NOT NULL,
    list_name character varying(50) DEFAULT NULL::character varying,
    note character varying(255) DEFAULT NULL::character varying,
    dislike bit(1) DEFAULT '0'::"bit",
    voice bit(1) DEFAULT '0'::"bit"
);


ALTER TABLE public.members_users OWNER TO merega;

--
-- TOC entry 209 (class 1259 OID 34786)
-- Name: members_users_member_id_seq; Type: SEQUENCE; Schema: public; Owner: merega
--

ALTER TABLE public.members_users ALTER COLUMN member_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.members_users_member_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 212 (class 1259 OID 34797)
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
-- TOC entry 213 (class 1259 OID 34802)
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
-- TOC entry 215 (class 1259 OID 34817)
-- Name: nets_events; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nets_events (
    event_id bigint NOT NULL,
    net_id bigint NOT NULL,
    user_id bigint NOT NULL,
    event_node_id bigint NOT NULL,
    notification_tpl_id bigint NOT NULL,
    event_code integer,
    notification_text character varying(255) DEFAULT NULL::character varying,
    new bit(1) DEFAULT '1'::"bit",
    shown bit(1) DEFAULT '0'::"bit"
);


ALTER TABLE public.nets_events OWNER TO merega;

--
-- TOC entry 214 (class 1259 OID 34816)
-- Name: nets_events_event_id_seq; Type: SEQUENCE; Schema: public; Owner: merega
--

ALTER TABLE public.nets_events ALTER COLUMN event_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.nets_events_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 211 (class 1259 OID 34796)
-- Name: nets_net_id_seq; Type: SEQUENCE; Schema: public; Owner: merega
--

ALTER TABLE public.nets ALTER COLUMN net_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.nets_net_id_seq
    START WITH 238
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 216 (class 1259 OID 34825)
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
-- TOC entry 218 (class 1259 OID 34832)
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
-- TOC entry 217 (class 1259 OID 34831)
-- Name: nodes_node_id_seq; Type: SEQUENCE; Schema: public; Owner: merega
--

ALTER TABLE public.nodes ALTER COLUMN node_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.nodes_node_id_seq
    START WITH 244
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 219 (class 1259 OID 34839)
-- Name: nodes_tmp; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.nodes_tmp (
    node_id bigint NOT NULL,
    email character varying(50) DEFAULT NULL::character varying,
    list_name character varying(50) DEFAULT NULL::character varying,
    note character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.nodes_tmp OWNER TO merega;

--
-- TOC entry 220 (class 1259 OID 34845)
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
-- TOC entry 222 (class 1259 OID 34854)
-- Name: notifications_tpl; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.notifications_tpl (
    notification_tpl_id bigint NOT NULL,
    event_code integer,
    notification_code integer,
    notification_text character varying(255) DEFAULT NULL::character varying,
    notification_action character varying(255) DEFAULT NULL::character varying,
    notification_close bit(1) DEFAULT '0'::"bit"
);


ALTER TABLE public.notifications_tpl OWNER TO merega;

--
-- TOC entry 221 (class 1259 OID 34853)
-- Name: notifications_tpl_notification_tpl_id_seq; Type: SEQUENCE; Schema: public; Owner: merega
--

ALTER TABLE public.notifications_tpl ALTER COLUMN notification_tpl_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notifications_tpl_notification_tpl_id_seq
    START WITH 58
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 224 (class 1259 OID 34865)
-- Name: sessions; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.sessions (
    session_id bigint NOT NULL,
    session_key character varying(255) NOT NULL,
    session_value character varying(255) NOT NULL
);


ALTER TABLE public.sessions OWNER TO merega;

--
-- TOC entry 223 (class 1259 OID 34864)
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
-- TOC entry 226 (class 1259 OID 34873)
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
-- TOC entry 228 (class 1259 OID 34888)
-- Name: users_notifications; Type: TABLE; Schema: public; Owner: merega
--

CREATE TABLE public.users_notifications (
    notification_id bigint NOT NULL,
    user_id bigint NOT NULL,
    code integer,
    notification character varying(511) DEFAULT NULL::character varying,
    new bit(1) DEFAULT '1'::"bit",
    shown bit(1) DEFAULT '0'::"bit",
    close bit(1) DEFAULT '0'::"bit"
);


ALTER TABLE public.users_notifications OWNER TO merega;

--
-- TOC entry 227 (class 1259 OID 34887)
-- Name: users_notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: merega
--

ALTER TABLE public.users_notifications ALTER COLUMN notification_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_notifications_notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 225 (class 1259 OID 34872)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: merega
--

ALTER TABLE public.users ALTER COLUMN user_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_user_id_seq
    START WITH 73
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3257 (class 2606 OID 34795)
-- Name: members_users pkMembersUsers; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members_users
    ADD CONSTRAINT "pkMembersUsers" PRIMARY KEY (member_id);


--
-- TOC entry 3261 (class 2606 OID 34801)
-- Name: nets pkNets; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets
    ADD CONSTRAINT "pkNets" PRIMARY KEY (net_id);


--
-- TOC entry 3265 (class 2606 OID 34824)
-- Name: nets_events pkNetsEvents; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_events
    ADD CONSTRAINT "pkNetsEvents" PRIMARY KEY (event_id);


--
-- TOC entry 3269 (class 2606 OID 34838)
-- Name: nodes pkNodes; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT "pkNodes" PRIMARY KEY (node_id);


--
-- TOC entry 3275 (class 2606 OID 34863)
-- Name: notifications_tpl pkNotificationsTpl; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.notifications_tpl
    ADD CONSTRAINT "pkNotificationsTpl" PRIMARY KEY (notification_tpl_id);


--
-- TOC entry 3277 (class 2606 OID 34871)
-- Name: sessions pkSessions; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "pkSessions" PRIMARY KEY (session_id);


--
-- TOC entry 3279 (class 2606 OID 34886)
-- Name: users pkUsers; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "pkUsers" PRIMARY KEY (user_id);


--
-- TOC entry 3281 (class 2606 OID 34898)
-- Name: users_notifications pkUsersNotifications; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_notifications
    ADD CONSTRAINT "pkUsersNotifications" PRIMARY KEY (notification_id);


--
-- TOC entry 3263 (class 2606 OID 34969)
-- Name: nets_data ukNet; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_data
    ADD CONSTRAINT "ukNet" UNIQUE (net_id);


--
-- TOC entry 3259 (class 2606 OID 34974)
-- Name: members_users ukNetUser; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members_users
    ADD CONSTRAINT "ukNetUser" UNIQUE (net_id, user_id);


--
-- TOC entry 3267 (class 2606 OID 34971)
-- Name: nets_events ukNetUserNode; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_events
    ADD CONSTRAINT "ukNetUserNode" UNIQUE (net_id, user_id, event_node_id);


--
-- TOC entry 3271 (class 2606 OID 34965)
-- Name: nodes_tmp ukNode; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_tmp
    ADD CONSTRAINT "ukNode" UNIQUE (node_id);


--
-- TOC entry 3283 (class 2606 OID 34967)
-- Name: users_notifications ukUser; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_notifications
    ADD CONSTRAINT "ukUser" UNIQUE (user_id);


--
-- TOC entry 3273 (class 2606 OID 34976)
-- Name: nodes_users ukUserNode; Type: CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_users
    ADD CONSTRAINT "ukUserNode" UNIQUE (user_id, node_id);


--
-- TOC entry 3285 (class 2606 OID 34904)
-- Name: members_users fkMembersUsersNet; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members_users
    ADD CONSTRAINT "fkMembersUsersNet" FOREIGN KEY (net_id) REFERENCES public.nets(net_id) ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3284 (class 2606 OID 34899)
-- Name: members_users fkMembersUsersUser; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.members_users
    ADD CONSTRAINT "fkMembersUsersUser" FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3286 (class 2606 OID 34909)
-- Name: nets_data fkNetsDataNet; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_data
    ADD CONSTRAINT "fkNetsDataNet" FOREIGN KEY (net_id) REFERENCES public.nets(net_id) NOT VALID;


--
-- TOC entry 3287 (class 2606 OID 34914)
-- Name: nets_events fkNetsEventsNet; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_events
    ADD CONSTRAINT "fkNetsEventsNet" FOREIGN KEY (net_id) REFERENCES public.nets(net_id) NOT VALID;


--
-- TOC entry 3289 (class 2606 OID 34924)
-- Name: nets_events fkNetsEventsNode; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_events
    ADD CONSTRAINT "fkNetsEventsNode" FOREIGN KEY (event_node_id) REFERENCES public.nodes(node_id) NOT VALID;


--
-- TOC entry 3290 (class 2606 OID 34929)
-- Name: nets_events fkNetsEventsNotificationTpl; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_events
    ADD CONSTRAINT "fkNetsEventsNotificationTpl" FOREIGN KEY (notification_tpl_id) REFERENCES public.notifications_tpl(notification_tpl_id) NOT VALID;


--
-- TOC entry 3288 (class 2606 OID 34919)
-- Name: nets_events fkNetsEventsUser; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_events
    ADD CONSTRAINT "fkNetsEventsUser" FOREIGN KEY (user_id) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3292 (class 2606 OID 34939)
-- Name: nets_users_data fkNetsUsersDataNet; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT "fkNetsUsersDataNet" FOREIGN KEY (net_id) REFERENCES public.nets(net_id) NOT VALID;


--
-- TOC entry 3291 (class 2606 OID 34934)
-- Name: nets_users_data fkNetsUsersDataUser; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nets_users_data
    ADD CONSTRAINT "fkNetsUsersDataUser" FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3293 (class 2606 OID 34944)
-- Name: nodes_tmp fkNodesTmpNode; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_tmp
    ADD CONSTRAINT "fkNodesTmpNode" FOREIGN KEY (node_id) REFERENCES public.nodes(node_id) NOT VALID;


--
-- TOC entry 3295 (class 2606 OID 34954)
-- Name: nodes_users fkNodesUsersNode; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_users
    ADD CONSTRAINT "fkNodesUsersNode" FOREIGN KEY (node_id) REFERENCES public.nodes(node_id) NOT VALID;


--
-- TOC entry 3294 (class 2606 OID 34949)
-- Name: nodes_users fkNodesUsersUser; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.nodes_users
    ADD CONSTRAINT "fkNodesUsersUser" FOREIGN KEY (user_id) REFERENCES public.users(user_id) NOT VALID;


--
-- TOC entry 3296 (class 2606 OID 34959)
-- Name: users_notifications fkUsersNotificationsUser; Type: FK CONSTRAINT; Schema: public; Owner: merega
--

ALTER TABLE ONLY public.users_notifications
    ADD CONSTRAINT "fkUsersNotificationsUser" FOREIGN KEY (user_id) REFERENCES public.users(user_id) NOT VALID;


-- Completed on 2022-11-13 21:08:38

--
-- PostgreSQL database dump complete
--
