-- Migration 006: Add media_types column to portfolio table
-- Tracks whether each entry in media_urls is an 'image' or 'video'

ALTER TABLE portfolio
  ADD COLUMN IF NOT EXISTS media_types TEXT[] DEFAULT '{}';

-- Backfill existing rows: assume all existing media_urls entries are images
UPDATE portfolio
  SET media_types = (
    SELECT ARRAY(
      SELECT 'image'
      FROM generate_series(1, GREATEST(jsonb_array_length(media_urls), 0))
    )
  )
WHERE jsonb_array_length(media_urls) > 0
  AND (media_types IS NULL OR array_length(media_types, 1) IS NULL);
