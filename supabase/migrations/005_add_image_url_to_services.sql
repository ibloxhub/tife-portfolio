-- Add image_url to services table
ALTER TABLE public.services
ADD COLUMN image_url TEXT;
