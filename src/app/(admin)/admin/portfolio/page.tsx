import { getAllPortfolios } from '@/lib/services/portfolio.service'
import { PortfolioGrid } from '@/components/admin/portfolio-grid'

export default async function PortfolioPage() {
  const result = await getAllPortfolios(undefined, { page: 1, limit: 100, sortBy: 'sort_order', sortOrder: 'asc' })
  const portfolios = result.data ?? []

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(200,169,126,0.6)]" />
          <span className="text-xs font-bold tracking-[0.3em] text-gold-light/40 uppercase">Media Library</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">Portfolio.</h1>
        <p className="text-text-secondary text-base font-light">Showcase your best work with uncompromising quality.</p>
      </div>

      <PortfolioGrid initialPortfolios={portfolios} />
    </div>
  )
}
