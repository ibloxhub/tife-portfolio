'use client'

import { useState, useRef } from 'react'
import { Play, X } from '@phosphor-icons/react'

interface FeaturedReelSectionProps {
  reelUrl?: string
}

function getEmbedUrl(url: string): string {
  if (!url) return ''
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&color=C8A97E`
  return url
}

export function FeaturedReelSection({ reelUrl }: FeaturedReelSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const embedUrl = reelUrl ? getEmbedUrl(reelUrl) : ''

  if (!reelUrl) return null

  return (
    <>
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,126,0.05)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-4 block">
              Showreel
            </span>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white">
              Watch How We See the World
            </h2>
          </div>

          {/* Video Thumbnail / Play Area */}
          <div
            className="relative w-full aspect-video rounded-[3rem] overflow-hidden bg-white/[0.02] border border-white/[0.06] group cursor-pointer shadow-2xl"
            onClick={() => setIsOpen(true)}
          >
            {/* Dark overlay with play button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-black/60 group-hover:bg-black/40 transition-all duration-700 z-10">
              {/* Animated ring */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
                <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500">
                  <Play
                    weight="fill"
                    className="h-8 w-8 md:h-10 md:w-10 text-gold group-hover:text-black ml-1 transition-colors duration-500"
                  />
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 group-hover:text-white transition-colors duration-500">
                Play Showreel
              </span>
            </div>

            {/* Cinematic background still */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#0D0D0F] via-[#1a1205] to-[#0D0D0F]"
              style={{
                backgroundImage: 'url(/hero.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.4,
              }}
            />
          </div>

          {/* Sub-line */}
          <p className="mt-8 text-center text-white/25 text-sm max-w-lg mx-auto leading-relaxed">
            Every frame in our reel is from a real client project — no test shots, no filler.
          </p>
        </div>
      </section>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
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
