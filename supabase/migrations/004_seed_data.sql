-- Insert Settings
INSERT INTO settings (site_name, tagline, contact_email)
VALUES ('ShotThatWithTife', 'Cinematic Experiences. Immortalized.', 'hello@shotthatwithtife.com');

-- Insert Sample Services
INSERT INTO services (name, slug, category, short_description, icon_name, cta_text)
VALUES 
  ('Wedding Cinematography', 'wedding-cinematography', 'Video', 'Relive your special day through a cinematic lens.', 'VideoCamera', 'Book Your Wedding'),
  ('Brand Storytelling', 'brand-storytelling', 'Marketing', 'Commercial videography that converts.', 'Storefront', 'Elevate Your Brand'),
  ('Editorial Photography', 'editorial-photography', 'Photo', 'High-end photography for personal and commercial brands.', 'Camera', 'Book a Shoot');

-- Insert Sample Portfolio Items
INSERT INTO portfolio (title, slug, category, description, is_featured, is_published)
VALUES 
  ('The Lagos Royal Wedding', 'lagos-royal-wedding', 'event', 'A majestic 3-day wedding event covered in ultra-high definition.', true, true),
  ('Neon Nights Fashion Campaign', 'neon-nights-campaign', 'marketing', 'A moody, cinematic shoot for a streetwear brand.', true, true),
  ('Lumina Tech Commercial', 'lumina-tech', 'video', 'Sleek product videography with high-end motion control.', false, true);
