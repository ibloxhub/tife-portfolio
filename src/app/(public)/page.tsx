import { getFeaturedPortfolios } from '@/lib/services/portfolio.service'
import { getAllServices } from '@/lib/services/services.service'
import { getSettings } from '@/lib/services/settings.service'

import { HeroSection } from '@/components/public/hero-section'
import { SocialProofBar } from '@/components/public/social-proof-bar'
import { FeaturedWork } from '@/components/public/featured-work'
import { IntroSection } from '@/components/public/intro-section'
import { ServicesPreview } from '@/components/public/services-preview'
import { ProcessSection } from '@/components/public/process-section'
import { TestimonialsSection } from '@/components/public/testimonials-section'
import { FinalCTA } from '@/components/public/final-cta'

export default async function HomePage() {
  // Fetch data from admin CMS
  const [portfolioResult, servicesResult, settingsResult] = await Promise.all([
    getFeaturedPortfolios(6),
    getAllServices(),
    getSettings(),
  ])

  const featured = portfolioResult.data ?? []
  const services = (servicesResult.data ?? []).filter((s) => s.is_active)
  const settings = settingsResult.data

  return (
    <div className="flex flex-col">
      {/* Section 1 — Hero */}
      <HeroSection 
        siteName={settings?.site_name ?? 'ShotThatWithTife'} 
        tagline={settings?.tagline ?? 'Cinematic Visual Stories'}
      />

      {/* Section 2 — Social Proof Bar */}
      <SocialProofBar />

      {/* Section 3 — Selected Work */}
      <FeaturedWork items={featured} />

      {/* Section 4 — Who I Am */}
      <IntroSection 
        aboutText={settings?.about_text ?? undefined} 
        aboutImage={settings?.about_image_url ?? undefined}
      />

      {/* Section 5 — Services */}
      <ServicesPreview services={services} />

      {/* Section 6 — The Process */}
      <ProcessSection />

      {/* Section 7 — Testimonials */}
      <TestimonialsSection />

      {/* Section 8 — Final CTA */}
      <FinalCTA 
        email={settings?.contact_email ?? undefined} 
        whatsapp={settings?.whatsapp_number ?? undefined}
      />
    </div>
  )
}
