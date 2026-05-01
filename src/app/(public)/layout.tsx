import { getSettings } from '@/lib/services/settings.service'
import { PublicNavbar } from '@/components/public/public-navbar'
import { PublicFooter } from '@/components/public/public-footer'
import { WhatsAppButton } from '@/components/public/whatsapp-button'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { data: settings } = await getSettings()

  const siteName = settings?.site_name ?? 'ShotThatWithTife'
  const tagline = settings?.tagline ?? 'Cinematic Visual Stories'
  const contactEmail = settings?.contact_email ?? ''
  const whatsappNumber = settings?.whatsapp_number ?? ''
  const socialLinks = (settings?.social_links ?? {}) as Record<string, string>

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* ── Global Ambient Background ── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")',
          }}
        />
        {/* Ambient Orbs */}
        <div className="absolute top-[15%] left-[5%] w-[35%] h-[25%] rounded-full bg-gold/[0.04] blur-[150px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[20%] rounded-full bg-white/[0.03] blur-[120px]" />
        <div className="absolute top-[60%] left-[50%] w-[25%] h-[15%] rounded-full bg-gold/[0.02] blur-[100px]" />
      </div>

      {/* ── Navbar ── */}
      <PublicNavbar siteName={siteName} />

      {/* ── Main Content ── */}
      <main className="relative z-10">{children}</main>

      {/* ── Footer ── */}
      <PublicFooter
        siteName={siteName}
        tagline={tagline}
        contactEmail={contactEmail}
        socialLinks={socialLinks}
      />

      {/* ── WhatsApp Floating Button ── */}
      {whatsappNumber && <WhatsAppButton phoneNumber={whatsappNumber} />}
    </div>
  )
}
