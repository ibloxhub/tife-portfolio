import Link from 'next/link'
import { WhatsappLogo } from '@phosphor-icons/react/dist/ssr'

interface FinalCTAProps {
  email?: string
  whatsapp?: string
}

export function FinalCTA({ email, whatsapp }: FinalCTAProps) {
  return (
    <section className="py-40 px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[600px] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter text-white leading-[0.85] mb-12">
          Let&apos;s Create <br />
          <span className="bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
            Something Beautiful
          </span>
          <br /> Together
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <Link 
            href="/contact"
            className="h-16 px-12 rounded-full bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold hover:shadow-[0_0_30px_rgba(200,169,126,0.4)] transition-all duration-500 flex items-center"
          >
            Book a Session
          </Link>
          <Link 
            href="/archive"
            className="h-16 px-12 rounded-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-all duration-500 flex items-center"
          >
            View My Work
          </Link>
        </div>

        {/* Contact Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
          {email && (
            <a href={`mailto:${email}`} className="hover:text-gold transition-colors">
              {email}
            </a>
          )}
          {whatsapp && (
            <a 
              href={`https://wa.me/${whatsapp.replace(/[\s\-+]/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <WhatsappLogo weight="bold" className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
