import { Metadata } from 'next'
import { getSettings } from '@/lib/services/settings.service'
import { getAllServices } from '@/lib/services/services.service'
import { PublicContactForm } from '@/components/public/public-contact-form'
import { EnvelopeSimple, WhatsappLogo, MapPin } from '@phosphor-icons/react/dist/ssr'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Ready to bring your vision to life? Get in touch to start a conversation.',
}

export default async function ContactPage() {
  const [settingsResult, servicesResult] = await Promise.all([
    getSettings(),
    getAllServices()
  ])

  const settings = settingsResult.data
  const services = (servicesResult.data ?? [])
    .filter(s => s.is_active)
    .map(s => s.name || s.category || 'Unnamed Service')

  return (
    <div className="min-h-screen pt-40 pb-40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Info */}
          <div className="flex flex-col gap-12 lg:pr-10">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-2 block">
                Get In Touch
              </span>
              <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-white leading-[0.9]">
                Let&apos;s Create <br /> 
                <span className="text-gold">Something Great.</span>
              </h1>
              <p className="mt-6 text-white/40 text-lg leading-relaxed font-light">
                Ready to bring your vision to life? Fill out the form or reach out through social channels. I usually respond within 24 hours.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              {/* Email */}
              <div className="flex items-start gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all duration-500">
                  <EnvelopeSimple weight="bold" className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Email Me</span>
                  <a href={`mailto:${settings?.contact_email}`} className="text-lg text-white/60 hover:text-white transition-colors">
                    {settings?.contact_email || 'hello@shotthatwithtife.com'}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all duration-500">
                  <WhatsappLogo weight="bold" className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">WhatsApp</span>
                  <a 
                    href={`https://wa.me/${settings?.whatsapp_number?.replace(/[\s\-+]/g, '')}`} 
                    target="_blank" 
                    className="text-lg text-white/60 hover:text-white transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all duration-500">
                  <MapPin weight="bold" className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Location</span>
                  <span className="text-lg text-white/60">Lagos, Nigeria (Available Globally)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="w-full">
            <div className="relative w-full">
              {/* Glow layer with overflow hidden to respect rounded corners */}
              <div className="absolute inset-0 bg-white/[0.02] border border-white/[0.06] rounded-[3rem] overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full -mr-32 -mt-32" />
              </div>
              
              {/* Form Content - without overflow-hidden so the dropdown can escape */}
              <div className="relative z-10 w-full p-8 md:p-12 shadow-2xl rounded-[3rem] bg-white/[0.01]">
                <PublicContactForm services={services} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
