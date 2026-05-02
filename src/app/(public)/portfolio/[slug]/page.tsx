import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPortfolioBySlug, getAllPortfolios } from '@/lib/services/portfolio.service'
import { ViewTracker } from '@/components/public/view-tracker'
import { ArrowLeft, Calendar, Tag, Eye } from '@phosphor-icons/react/dist/ssr'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: project } = await getPortfolioBySlug(slug)

  if (!project) return { title: 'Not Found' }

  return {
    title: project.title,
    description: project.description || `View ${project.title} by ShotThatWithTife`,
    openGraph: {
      title: project.title,
      description: project.description || `View ${project.title} by ShotThatWithTife`,
      images: project.thumbnail_url ? [{ url: project.thumbnail_url }] : [],
    },
  }
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = await params
  const { data: project } = await getPortfolioBySlug(slug)

  if (!project || !project.is_published) {
    notFound()
  }

  // Fetch related projects
  const { data: related } = await getAllPortfolios({ 
    category: project.category as any,
    isPublished: true 
  })
  
  const relatedFiltered = (related ?? [])
    .filter(p => p.id !== project.id)
    .slice(0, 3)

  const mediaUrls = project.media_urls as string[] ?? []

  return (
    <div className="min-h-screen bg-[#050505]">
      <ViewTracker portfolioId={project.id} portfolioTitle={project.title} />

      {/* Hero Header */}
      <section className="relative h-[70dvh] w-full overflow-hidden">
        <Image
          src={project.thumbnail_url || '/placeholder-work.png'}
          alt={project.title}
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#050505]" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-20">
          <Link 
            href="/portfolio"
            className="mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all group"
          >
            <ArrowLeft weight="bold" className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-4 block">
            {project.category}
          </span>
          <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter text-white leading-[0.9] max-w-4xl">
            {project.title}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Project Info */}
            <div className="lg:col-span-4 flex flex-col gap-10">
              <div className="space-y-6">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-4">
                  The Concept
                </h2>
                <p className="text-lg text-white/60 leading-relaxed font-light">
                  {project.description || "No description provided for this project."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 block">Category</span>
                  <div className="flex items-center gap-2 text-white/60">
                    <Tag className="h-4 w-4 text-gold" />
                    <span className="text-sm font-medium">{project.category}</span>
                  </div>
                </div>
              </div>
              
              <Link 
                href="/contact"
                className="mt-4 h-14 w-full rounded-2xl bg-white/[0.05] border border-white/10 text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-gold hover:text-black hover:border-gold transition-all duration-500 flex items-center justify-center"
              >
                Inquire About This Style
              </Link>
            </div>

            {/* Media Gallery */}
            <div className="lg:col-span-8 flex flex-col gap-12">
              {mediaUrls.length > 0 ? (
                mediaUrls.map((url, i) => (
                  <div key={i} className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/[0.06]">
                    <Image
                      src={url}
                      alt={`${project.title} - Media ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedFiltered.length > 0 && (
        <section className="py-32 px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-4 mb-16">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">
                Next Story
              </span>
              <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-white">
                Related Work
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedFiltered.map((p) => (
                <Link 
                  key={p.id}
                  href={`/portfolio/${p.slug}`}
                  className="group block relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/[0.02] border border-white/[0.06]"
                >
                  <Image
                    src={p.thumbnail_url || '/placeholder-work.png'}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2">{p.category}</span>
                    <h3 className="text-xl font-bold text-white tracking-tight">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
