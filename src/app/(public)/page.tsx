import { getFeaturedPortfolios } from '@/lib/services/portfolio.service'
import { getAllServices } from '@/lib/services/services.service'
import { getSettings } from '@/lib/services/settings.service'
import type { Metadata } from 'next'

import { HeroSection } from '@/components/public/hero-section'
import { SocialProofBar } from '@/components/public/social-proof-bar'
import { FeaturedWork } from '@/components/public/featured-work'
import { WhyUsSection } from '@/components/public/why-us-section'
import { IntroSection } from '@/components/public/intro-section'
import { ServicesPreview } from '@/components/public/services-preview'
import { FeaturedReelSection } from '@/components/public/featured-reel-section'
import { ProcessSection } from '@/components/public/process-section'
import { ClientBrandsSection } from '@/components/public/client-brands-section'
import { TestimonialsSection } from '@/components/public/testimonials-section'
import { FaqSection } from '@/components/public/faq-section'
import { FinalCTA } from '@/components/public/final-cta'

export const metadata: Metadata = {
  title: 'Where Light Meets Legacy | Cinematic Videography & Photography',
  description:
    'IBlox Studio — premium cinematic videography and photography for brands, weddings, and editorial campaigns. We craft visual stories that endure.',
  keywords: [
    'cinematic videography studio',
    'brand film production',
    'commercial photography',
    'wedding cinematography',
    'editorial photography',
    'video production studio',
    'creative film studio',
    'brand storytelling video',
    'professional videographer',
    'cinematic photographer',
  ],
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [portfolioResult, servicesResult, settingsResult] = await Promise.all([
    getFeaturedPortfolios(6),
    getAllServices(),
    getSettings(),
  ])

  const featured = portfolioResult.data ?? []
  const services = (servicesResult.data ?? []).filter((s) => s.is_active)
  const settings = settingsResult.data
  const reelUrl = (settings as any)?.reel_url ?? undefined

  return (
    <div className="flex flex-col">
      {/* 1 — Hero */}
      <HeroSection
        siteName={settings?.site_name ?? 'IBlox Studio'}
        tagline={settings?.tagline ?? 'Where Light Becomes Legacy'}
        reelUrl={reelUrl}
      />

      {/* 2 — Selected Work */}
      <FeaturedWork items={featured} />

      {/* 3 — Stats Bar */}
      <SocialProofBar />

      {/* 4 — Why Us */}
      <WhyUsSection />

      {/* 5 — Services */}
      <ServicesPreview services={services} />

      {/* 6 — Featured Reel */}
      <FeaturedReelSection reelUrl={reelUrl} />

      {/* 7 — Studio Story */}
      <IntroSection
        aboutText={settings?.about_text ?? undefined}
        aboutImage={settings?.about_image_url ?? undefined}
      />

      {/* 8 — How We Work */}
      <ProcessSection />

      {/* 9 — Client Brands */}
      <ClientBrandsSection />

      {/* 10 — Testimonials */}
      <TestimonialsSection />

      {/* 11 — FAQ */}
      <FaqSection />

      {/* 12 — Final CTA */}
      <FinalCTA
        email={settings?.contact_email ?? undefined}
        whatsapp={settings?.whatsapp_number ?? undefined}
      />
    </div>
  )
}
