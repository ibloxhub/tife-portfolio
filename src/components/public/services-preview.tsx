import Link from 'next/link'
import { Camera, VideoCamera, Calendar, Megaphone, ArrowRight } from '@phosphor-icons/react/dist/ssr'
import type { Service } from '@/lib/services/types'

interface ServicesPreviewProps {
  services: Service[]
}

const iconMap: Record<string, any> = {
  photography: Camera,
  videography: VideoCamera,
  events: Calendar,
  marketing: Megaphone,
}

export function ServicesPreview({ services }: ServicesPreviewProps) {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-4 block">
            Capabilities
          </span>
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white">
            What I Do
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = iconMap[service.category?.toLowerCase() ?? ''] || Camera
            
            return (
              <div 
                key={service.id}
                className="group relative p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.06] hover:border-gold/30 hover:bg-gold/[0.02] transition-all duration-700 overflow-hidden"
              >
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-gold/10 transition-colors" />
                
                <div className="relative z-10 flex flex-col gap-6 h-full">
                  <div className="h-14 w-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-gold group-hover:scale-110 group-hover:bg-gold group-hover:text-black transition-all duration-500">
                    <Icon weight="bold" className="h-7 w-7" />
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase">
                      {service.name || service.category || 'Service'}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                  
                  <Link 
                    href={`/contact?service=${service.name}`}
                    className="mt-auto flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-gold transition-colors"
                  >
                    {service.cta_text || 'Book Now'}
                    <ArrowRight weight="bold" className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
