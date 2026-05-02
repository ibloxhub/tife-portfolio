import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllServices } from '@/lib/services/services.service'
import { cn } from '@/lib/utils'
import { ArrowRight, CheckCircle } from '@phosphor-icons/react/dist/ssr'

export const metadata: Metadata = {
  title: 'Services',
  description: 'From cinematic videography to intimate photography, high-end visual solutions tailored to your unique story.',
}

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const { data: allServices } = await getAllServices()
  const services = (allServices ?? []).filter(s => s.is_active)

  return (
    <div className="min-h-screen pt-40 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-32">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-4 block">
            Offerings
          </span>
          <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter text-white leading-[0.9]">
            My Services
          </h1>
          <p className="mt-8 text-white/30 text-sm max-w-xl mx-auto leading-relaxed">
            From cinematic videography to intimate photography, I provide high-end visual solutions tailored to your unique story.
          </p>
        </div>

        {/* Services List (Zigzag) */}
        <div className="flex flex-col gap-32 md:gap-48">
          {services.map((service, i) => {
            const isEven = i % 2 === 1
            
            return (
              <section 
                key={service.id}
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center",
                  isEven ? "lg:flex-row-reverse" : ""
                )}
              >
                {/* Visual Side */}
                <div className={cn(
                  "relative aspect-[4/3] rounded-[3rem] overflow-hidden bg-white/[0.02] border border-white/[0.06] group",
                  isEven ? "lg:order-2" : ""
                )}>
                  <Image
                    src={service.image_url || '/placeholder-service.png'}
                    alt={service.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Content Side */}
                <div className={cn(
                  "flex flex-col gap-8",
                  isEven ? "lg:order-1" : ""
                )}>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold uppercase tracking-[0.5em] text-gold/60">
                      0{i + 1} // {service.category}
                    </span>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-[0.9]">
                      {service.name || service.category || 'Service'}
                    </h2>
                  </div>

                  <p className="text-lg text-white/50 leading-relaxed font-light">
                    {service.description}
                  </p>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Placeholder features if none provided in schema yet */}
                    {['Professional Gear', 'Cinematic Color Grade', '4K Delivery', 'Creative Direction'].map(feature => (
                      <li key={feature} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                        <CheckCircle weight="fill" className="h-4 w-4 text-gold" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link 
                    href={`/contact?service=${encodeURIComponent(service.name)}`}
                    className="mt-4 h-16 w-fit px-10 rounded-full bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-gold transition-all duration-500 flex items-center gap-3 group"
                  >
                    {service.cta_text || 'Inquire Now'}
                    <ArrowRight weight="bold" className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
