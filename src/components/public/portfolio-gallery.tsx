'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Portfolio } from '@/lib/services/types'

interface PortfolioGalleryProps {
  initialItems: Portfolio[]
}

const categories = ['All', 'Photography', 'Videography', 'Events', 'Marketing']

export function PortfolioGallery({ initialItems }: PortfolioGalleryProps) {
  const [filter, setFilter] = useState('All')

  const filteredItems = filter === 'All' 
    ? initialItems 
    : initialItems.filter(item => item.category?.toLowerCase() === filter.toLowerCase())

  return (
    <div className="flex flex-col gap-16">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border transition-all duration-500",
              filter === cat
                ? "bg-gold border-gold text-black shadow-[0_0_20px_rgba(200,169,126,0.3)]"
                : "bg-white/[0.03] border-white/10 text-white/40 hover:text-white hover:border-white/20"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredItems.map((item) => (
          <Link 
            key={item.id}
            href={`/portfolio/${item.slug}`}
            className="block group relative overflow-hidden rounded-[2rem] bg-white/[0.02] border border-white/[0.06] break-inside-avoid transform-gpu"
          >
            <div className="relative aspect-auto">
              <Image
                src={item.thumbnail_url || '/placeholder-work.png'}
                alt={item.title}
                width={800}
                height={1200}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2">
                {item.category}
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-32 text-center">
          <p className="text-white/20 text-xs uppercase tracking-[0.3em]">No projects found in this category.</p>
        </div>
      )}
    </div>
  )
}
