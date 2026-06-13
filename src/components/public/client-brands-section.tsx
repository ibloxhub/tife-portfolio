'use client'

import { useRef, useEffect } from 'react'

// Generic premium brand names for the demo — client can replace via admin
const defaultBrands = [
  'Apex Creative',
  'Velour Films',
  'Meridian Brands',
  'Northlight Co.',
  'Crestwood Media',
  'Solaris Group',
  'Ember Studios',
  'Halcyon Agency',
  'Dusk Pictures',
  'Prism & Co.',
]

interface ClientBrandsSectionProps {
  brands?: string[]
}

export function ClientBrandsSection({ brands }: ClientBrandsSectionProps) {
  const items = brands && brands.length > 0 ? brands : defaultBrands
  // Duplicate for seamless infinite scroll
  const allItems = [...items, ...items]

  return (
    <section className="py-20 relative overflow-hidden border-y border-white/[0.05]">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0D0D0F] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0D0D0F] to-transparent z-10 pointer-events-none" />

      <div className="text-center mb-12">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
          Trusted By
        </span>
      </div>

      {/* Scrolling track */}
      <div className="overflow-hidden">
        <div className="flex gap-16 animate-brand-scroll whitespace-nowrap">
          {allItems.map((brand, i) => (
            <div
              key={`${brand}-${i}`}
              className="flex-shrink-0 flex items-center gap-4"
            >
              {/* Brand logo placeholder — elegant text treatment */}
              <div className="flex items-center gap-3 group">
                <div className="h-[1px] w-6 bg-gold/30 group-hover:w-10 transition-all duration-500" />
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/20 group-hover:text-white/60 transition-colors duration-500 select-none">
                  {brand}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes brand-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-brand-scroll {
          animation: brand-scroll 30s linear infinite;
        }
        .animate-brand-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
