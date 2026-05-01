import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/lib/utils'
import type { Portfolio } from '@/lib/services/types'

interface FeaturedWorkProps {
  items: Portfolio[]
}

export function FeaturedWork({ items }: FeaturedWorkProps) {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">
              Portfolio
            </span>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white">
              Selected Work
            </h2>
          </div>
          <Link 
            href="/portfolio" 
            className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all"
          >
            View Full Portfolio
            <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all">
              <ArrowRight weight="bold" className="h-4 w-4" />
            </div>
          </Link>
        </div>

        {/* Asymmetric Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-[300px]">
          {items.map((item, i) => {
            // Editorial rhythm logic
            const isLarge = i === 0 || i === 5
            const isMedium = i === 3
            
            const colSpan = isLarge ? 'lg:col-span-8' : isMedium ? 'lg:col-span-7' : 'lg:col-span-4'
            if (i === 1) return <div key={item.id} className={cn("relative overflow-hidden rounded-[2.5rem] group cursor-pointer lg:col-span-4", colSpan)}>
                <PortfolioCard item={item} />
            </div>
            if (i === 2) return <div key={item.id} className={cn("relative overflow-hidden rounded-[2.5rem] group cursor-pointer lg:col-span-4", colSpan)}>
                <PortfolioCard item={item} />
            </div>
            
            return (
              <div 
                key={item.id} 
                className={cn(
                  "relative overflow-hidden rounded-[2.5rem] group cursor-pointer",
                  colSpan,
                  isLarge ? "lg:row-span-2" : ""
                )}
              >
                <PortfolioCard item={item} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function PortfolioCard({ item }: { item: Portfolio }) {
  return (
    <Link href={`/portfolio/${item.slug}`} className="block h-full w-full">
      <Image
        src={item.thumbnail_url || '/placeholder-work.png'}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2 block">
          {item.category}
        </span>
        <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
          {item.title}
        </h3>
      </div>
    </Link>
  )
}
