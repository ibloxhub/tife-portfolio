import { Metadata } from 'next'
import { getAllPortfolios } from '@/lib/services/portfolio.service'
import { PortfolioGallery } from '@/components/public/portfolio-gallery'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'A curated collection of visual stories, ranging from intimate weddings to high-impact brand campaigns.',
}

export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  const { data: portfolios } = await getAllPortfolios({ isPublished: true })
  
  return (
    <div className="min-h-screen pt-40 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-4 block">
            Portfolio
          </span>
          <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter text-white leading-[0.9]">
            Portfolio
          </h1>
          <p className="mt-8 text-white/30 text-sm max-w-xl mx-auto leading-relaxed">
            A curated collection of visual stories, ranging from intimate weddings to high-impact brand campaigns.
          </p>
        </div>

        {/* Gallery with Filtering */}
        <PortfolioGallery initialItems={portfolios ?? []} />
      </div>
    </div>
  )
}
