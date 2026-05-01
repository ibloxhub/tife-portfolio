'use client'

import Image from 'next/image'
import { CaretDown } from '@phosphor-icons/react'

interface HeroSectionProps {
  siteName: string
  tagline: string
}

export function HeroSection({ siteName, tagline }: HeroSectionProps) {
  return (
    <section className="relative h-dvh w-full overflow-hidden flex items-center justify-center">
      {/* Cinematic Image Background with Premium Overlays */}
      <div className="absolute inset-0 z-0 bg-black">
        <Image
          src="/hero.png"
          alt="Hero Background"
          fill
          priority
          className="object-cover animate-ken-burns opacity-60"
          sizes="100vw"
        />
        
        {/* Film Grain / Noise Overlay to blend the image into the dark aesthetic */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} 
        />

        {/* Extreme Vignette to ensure text readability and cinematic framing */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.95)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter leading-[0.85] text-white">
          <span className="block opacity-90">{siteName.substring(0, 8)}</span>
          <span className="block bg-gradient-to-b from-white via-white to-gold/60 bg-clip-text text-transparent">
            {siteName.substring(8)}
          </span>
        </h1>
        <p className="mt-8 text-base sm:text-lg md:text-xl text-white/50 tracking-[0.2em] uppercase font-medium max-w-2xl mx-auto">
          {tagline}
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gold/60 animate-scroll-line" />
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-ken-burns {
          animation: ken-burns 20s ease-out forwards;
        }
        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scroll-line {
          animation: scroll-line 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
      `}</style>
    </section>
  )
}
