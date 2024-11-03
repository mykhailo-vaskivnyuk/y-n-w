ALTER TABLE IF EXISTS public.events
    ALTER COLUMN date SET DEFAULT now();

ALTER TABLE IF EXISTS public.users_events
    ALTER COLUMN notification_date SET DEFAULT now();