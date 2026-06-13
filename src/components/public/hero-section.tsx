'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Play, X } from '@phosphor-icons/react'

function getEmbedUrl(url: string): string {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&color=D4A843`
  return url
}

interface HeroSectionProps {
  siteName: string
  tagline: string
  reelUrl?: string
}

export function HeroSection({ siteName, tagline, reelUrl }: HeroSectionProps) {
  const [reelOpen, setReelOpen] = useState(false)
  const embedUrl = reelUrl ? getEmbedUrl(reelUrl) : ''

  return (
    <>
      <section className="relative h-dvh w-full overflow-hidden flex items-center justify-center">
        {/* Cinematic Image Background */}
        <div className="absolute inset-0 z-0 bg-[#16161A]">
          <Image
            src="/hero.png"
            alt="IBlox Studio — Cinematic Videography"
            fill
            priority
            className="object-cover animate-ken-burns opacity-60"
            sizes="100vw"
          />

          {/* Film Grain */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")' }}
          />

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(22,22,26,0.95)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#16161A]/60 via-transparent to-[#16161A]" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center gap-10">
          <div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter leading-[0.85] text-white">
              <span className="block opacity-90">{siteName.substring(0, 5)}</span>
              <span className="block bg-gradient-to-b from-white via-white to-gold/60 bg-clip-text text-transparent">
                {siteName.substring(5)}
              </span>
            </h1>
            <p className="mt-8 text-base sm:text-lg md:text-xl text-white/50 tracking-[0.2em] uppercase font-medium max-w-2xl mx-auto">
              {tagline}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {reelUrl && (
              <button
                onClick={() => setReelOpen(true)}
                className="group flex items-center gap-3 h-14 px-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black hover:border-white transition-all duration-500"
              >
                <span className="relative flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-60" />
                  <Play weight="fill" className="relative h-5 w-5 text-gold group-hover:text-black transition-colors duration-500" />
                </span>
                Play Showreel
              </button>
            )}
            <Link
              href="/contact"
              className="h-14 px-8 rounded-full bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-gold hover:shadow-[0_0_30px_rgba(212,168,67,0.4)] transition-all duration-500 flex items-center"
            >
              Book a Session
            </Link>
          </div>
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
          .animate-ken-burns { animation: ken-burns 20s ease-out forwards; }
          @keyframes scroll-line {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          .animate-scroll-line { animation: scroll-line 2s cubic-bezier(0.65,0,0.35,1) infinite; }
        `}</style>
      </section>

      {/* Reel Modal */}
      {reelOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
          onClick={() => setReelOpen(false)}
        >
          <button
            onClick={() => setReelOpen(false)}
            className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 z-10"
            aria-label="Close reel"
          >
            <X weight="bold" className="h-5 w-5" />
          </button>
          <div
            className="w-full max-w-5xl aspect-video rounded-[2rem] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="IBlox Studio Showreel"
            />
          </div>
        </div>
      )}
    </>
  )
}
