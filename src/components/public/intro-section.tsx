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
          {/* Left: Image */}
          <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5]">
            <div className="absolute -inset-4 border border-gold/20 rounded-[3rem] animate-pulse" />
            <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
              <Image
                src={aboutImage || '/placeholder-tife.png'}
                alt="About The Studio"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold/10 blur-[100px] rounded-full pointer-events-none" />
          </div>

          {/* Right: Content */}
          <div className="flex flex-col gap-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">
              Our Studio
            </span>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white leading-[0.9]">
              A Studio Built for Visual Storytelling.
            </h2>
            <div className="space-y-6">
              <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light">
                {aboutText || 'We transform concepts into compelling visual narratives. By blending technical mastery with artistic intuition, we create work that not only captures attention but defines brands, leaving a lasting impact in an ever-evolving digital landscape.'}
              </p>
              <p className="text-white/30 leading-relaxed italic">
                Every frame is intentional. Every story, timeless. This is the standard we hold ourselves to — on every production, without exception.
              </p>
            </div>

            {/* Belief lines */}
            <ul className="flex flex-col gap-3 pt-2">
              {[
                'We believe great work starts with listening.',
                'We believe every brand has a story worth telling well.',
                'We believe your deadline is sacred.',
              ].map((belief) => (
                <li key={belief} className="flex items-start gap-3 text-sm text-white/40">
                  <span className="text-gold mt-0.5 text-base leading-none">✦</span>
                  {belief}
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="mt-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white group"
            >
              Discover Our Studio
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
