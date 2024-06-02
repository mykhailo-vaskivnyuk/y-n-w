CREATE TABLE public.nets_guests (
	net_id bigint NOT NULL,
	user_id bigint NOT NULL,
	comment character varying(255) NOT NULL,
	CONSTRAINT pk_nets_guests PRIMARY KEY (net_id,user_id),
	CONSTRAINT fk_nets_guests_net FOREIGN KEY (net_id) REFERENCES public.nets(net_id) ON DELETE CASCADE,
	CONSTRAINT fk_nets_guests_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE
);
CREATE INDEX sk_nets_guests_net ON public.nets_guests (net_id);
CREATE INDEX sk_nets_guests_user ON public.nets_guests (user_id);

ALTER TABLE public.nets_data RENAME COLUMN resource_link TO net_link;
