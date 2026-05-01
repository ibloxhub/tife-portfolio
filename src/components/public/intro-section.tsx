import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

interface IntroSectionProps {
  aboutText?: string
  aboutImage?: string
}

export function IntroSection({ aboutText, aboutImage }: IntroSectionProps) {
  return (
    <section className="py-32 px-6 bg-white/[0.01]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Image with Decorative Elements */}
          <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5]">
            <div className="absolute -inset-4 border border-gold/20 rounded-[3rem] animate-pulse" />
            <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
              <Image
                src={aboutImage || '/placeholder-tife.png'}
                alt="About Tife"
                fill
                className="object-cover"
              />
            </div>
            {/* Ambient gold orb behind photo */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold/10 blur-[100px] rounded-full pointer-events-none" />
          </div>

          {/* Right: Content */}
          <div className="flex flex-col gap-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">
              The Story
            </span>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white leading-[0.9]">
              I&apos;m Tife — A Visual Storyteller based in Lagos.
            </h2>
            <div className="space-y-6">
              <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light">
                {aboutText || "I capture moments that feel alive, whether it's a wedding, a brand campaign, or a creative editorial. My mission is to translate raw emotion into cinematic visuals that last forever."}
              </p>
              <p className="text-white/30 leading-relaxed italic">
                Every frame tells a story. Every story deserves to be told with precision, passion, and a touch of the extraordinary.
              </p>
            </div>
            
            <Link 
              href="/about" 
              className="mt-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white group"
            >
              Learn More About Me
              <div className="h-10 w-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <ArrowRight weight="bold" className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
