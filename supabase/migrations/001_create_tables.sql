-- Create the custom categories enum for portfolio to ensure data integrity
CREATE TYPE portfolio_category AS ENUM ('photo', 'video', 'event', 'marketing');

-- 1. PORTFOLIO TABLE
CREATE TABLE portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category portfolio_category NOT NULL,
  media_urls JSONB DEFAULT '[]'::jsonb,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast querying
CREATE INDEX idx_portfolio_category ON portfolio(category);
CREATE INDEX idx_portfolio_is_featured ON portfolio(is_featured);
CREATE INDEX idx_portfolio_slug ON portfolio(slug);


-- 2. SERVICES TABLE
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT,
  description TEXT,
  short_description TEXT,
  icon_name TEXT,
  cta_text TEXT DEFAULT 'Get Started',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_services_slug ON services(slug);


-- Custom contact status enum
CREATE TYPE contact_status AS ENUM ('new', 'read', 'replied', 'archived');

-- 3. CONTACTS TABLE
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  service_name TEXT, -- Denormalized for quick dashboard views if service is deleted
  status contact_status DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at);
CREATE INDEX idx_contacts_service_id ON contacts(service_id);


-- Custom event types enum
CREATE TYPE tracking_event_type AS ENUM ('page_view', 'portfolio_view', 'service_click', 'contact_submit', 'cta_click');

-- 4. EVENTS (ANALYTICS) TABLE
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type tracking_event_type NOT NULL,
  page TEXT,
  entity_id UUID, -- Flexible reference (could be portfolio ID, service ID, etc)
  metadata JSONB DEFAULT '{}'::jsonb,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_entity_id ON events(entity_id);


-- 5. SETTINGS TABLE (Single row intended)
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT DEFAULT 'ShotThatWithTife',
  tagline TEXT,
  logo_url TEXT,
  about_text TEXT,
  about_image_url TEXT,
  contact_email TEXT,
  whatsapp_number TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  seo_defaults JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);
