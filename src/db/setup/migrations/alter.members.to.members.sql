ALTER TABLE IF EXISTS public.members_to_members
    ADD replacing boolean NOT NULL DEFAULT false;

ALTER TABLE IF EXISTS public.members_to_members
	DROP CONSTRAINT pk_members_to_members;

ALTER TABLE IF EXISTS public.members_to_members
	ADD CONSTRAINT pk_members_to_members PRIMARY KEY (from_member_id, to_member_id, replacing);
