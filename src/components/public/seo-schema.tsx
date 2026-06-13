/**
 * SEO Schema Components — Inject JSON-LD structured data for Google Rich Results.
 * These are server components (no 'use client' needed) that render <script> tags.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

// ── Professional Service Schema ────────────────────────────────────────────────
// Renders on all public pages via the public layout.

interface LocalBusinessSchemaProps {
  name?: string
  description?: string
  email?: string
  phone?: string
  instagramUrl?: string
}

export function LocalBusinessSchema({
  name = 'IBlox Studio',
  description = 'Premium cinematic videography and photography for brands, weddings, and editorial campaigns worldwide.',
  email,
  phone,
  instagramUrl,
}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${BASE_URL}/#business`,
    name,
    description,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/og-image.jpg`,
    areaServed: { '@type': 'Place', name: 'Worldwide' },
    priceRange: '$$$',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Cinematography & Photography Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Wedding Cinematography' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Brand Film Production' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Commercial Photography' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Editorial Photography' } },
      ],
    },
    ...(email && { email }),
    ...(phone && { telephone: phone }),
    ...(instagramUrl && { sameAs: [instagramUrl] }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── Creative Work Schema ───────────────────────────────────────────────────────
// Renders on individual portfolio project pages.

interface CreativeWorkSchemaProps {
  title: string
  description?: string | null
  thumbnailUrl?: string | null
  category?: string
  slug: string
  createdAt?: string
}

export function CreativeWorkSchema({
  title,
  description,
  thumbnailUrl,
  category,
  slug,
  createdAt,
}: CreativeWorkSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description: description || `${category} work by IBlox Studio`,
    url: `${BASE_URL}/portfolio/${slug}`,
    creator: {
      '@type': 'ProfessionalService',
      name: 'IBlox Studio',
      url: BASE_URL,
    },
    ...(thumbnailUrl && { image: thumbnailUrl }),
    ...(category && { genre: category }),
    ...(createdAt && { dateCreated: createdAt }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── Website Schema ─────────────────────────────────────────────────────────────
// Renders on the homepage. Enables the Google Sitelinks search box.

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'IBlox Studio',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/portfolio?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
