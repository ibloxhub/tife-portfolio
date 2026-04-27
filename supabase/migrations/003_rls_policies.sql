-- ENABLE ROW LEVEL SECURITY
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 1. PORTFOLIO POLICIES
-- Anyone can read published portfolio items
CREATE POLICY "Public profiles are viewable by everyone." 
  ON portfolio FOR SELECT 
  USING (is_published = true);

-- Only authenticated admins can insert/update/delete
CREATE POLICY "Admins have full access to portfolio." 
  ON portfolio FOR ALL 
  USING (auth.role() = 'authenticated');


-- 2. SERVICES POLICIES
-- Anyone can read active services
CREATE POLICY "Active services are viewable by everyone." 
  ON services FOR SELECT 
  USING (is_active = true);

-- Only authenticated admins can insert/update/delete
CREATE POLICY "Admins have full access to services." 
  ON services FOR ALL 
  USING (auth.role() = 'authenticated');


-- 3. CONTACTS POLICIES
-- Anyone can insert a contact (submit form)
CREATE POLICY "Anyone can submit a contact form." 
  ON contacts FOR INSERT 
  WITH CHECK (true);

-- Only authenticated admins can view and update contacts
CREATE POLICY "Admins can view all contacts." 
  ON contacts FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update contacts." 
  ON contacts FOR UPDATE 
  USING (auth.role() = 'authenticated');


-- 4. EVENTS (ANALYTICS) POLICIES
-- Anyone can insert an event (tracking)
CREATE POLICY "Anyone can insert an event." 
  ON events FOR INSERT 
  WITH CHECK (true);

-- Only authenticated admins can view events
CREATE POLICY "Admins can view events." 
  ON events FOR SELECT 
  USING (auth.role() = 'authenticated');


-- 5. SETTINGS POLICIES
-- Anyone can view settings (site config)
CREATE POLICY "Settings are viewable by everyone." 
  ON settings FOR SELECT 
  USING (true);

-- Only authenticated admins can update settings
CREATE POLICY "Admins can update settings." 
  ON settings FOR UPDATE 
  USING (auth.role() = 'authenticated');
