import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSettings } from '@/lib/services/settings.service'
import { ArrowRight, InstagramLogo, TiktokLogo, YoutubeLogo, CheckCircle } from '@phosphor-icons/react/dist/ssr'

export const metadata: Metadata = {
  title: 'About',
  description: 'The creative behind the lens. Visualizing pure emotion.',
}

export default async function AboutPage() {
  const { data: settings } = await getSettings()
  const socialLinks = (settings?.social_links ?? {}) as Record<string, string>

  return (
    <div className="min-h-screen pt-40 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section 1: The Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center mb-40">
          <div className="lg:col-span-5 relative aspect-[3/4] rounded-[3rem] overflow-hidden group shadow-2xl">
            <Image
              src={settings?.about_image_url || '/placeholder-tife.png'}
              alt={settings?.site_name || 'Tife'}
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gold/10 mix-blend-overlay group-hover:opacity-0 transition-opacity" />
          </div>

          <div className="lg:col-span-7 flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-2 block">
                The Creative Behind The Lens
              </span>
              <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter text-white leading-[0.9]">
                Visualizing <br /> 
                <span className="text-gold">Pure Emotion.</span>
              </h1>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col gap-6 text-xl md:text-2xl text-white/70 font-light leading-relaxed">
                {settings?.about_text ? (
                  settings.about_text.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <p>I am a creative visionary based in Lagos, Nigeria, dedicated to capturing the essence of every story through cinematic visuals. With over 5 years of experience, I blend technical precision with artistic intuition.</p>
                )}
              </div>

              {/* Social Connect */}
              <div className="flex items-center gap-6 pt-8 border-t border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Follow My Process:</span>
                <div className="flex items-center gap-4">
                  {socialLinks.instagram && (
                    <a href={socialLinks.instagram} target="_blank" className="text-white/40 hover:text-gold transition-colors">
                      <InstagramLogo weight="bold" className="h-5 w-5" />
                    </a>
                  )}
                  {socialLinks.tiktok && (
                    <a href={socialLinks.tiktok} target="_blank" className="text-white/40 hover:text-gold transition-colors">
                      <TiktokLogo weight="bold" className="h-5 w-5" />
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a href={socialLinks.youtube} target="_blank" className="text-white/40 hover:text-gold transition-colors">
                      <YoutubeLogo weight="bold" className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: The Philosophy */}
        <div className="mb-40 py-20 px-10 md:px-20 rounded-[3rem] bg-white/[0.02] border border-white/[0.05] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,169,126,0.05)_0%,transparent_70%)]" />
          <h2 className="relative z-10 text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8">
            "I don't just take pictures. <br/> <span className="text-gold">I craft legacies.</span>"
          </h2>
          <p className="relative z-10 text-white/50 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Every brand has a pulse. Every event has a soul. My philosophy is rooted in authenticity—stripping away the artificial to reveal the raw, unscripted moments that truly resonate. Whether it's a high-end commercial shoot or an intimate wedding, my goal remains the same: to create visuals that make you feel something profound.
          </p>
        </div>

        {/* Section 3: The Approach */}
        <div className="mb-40">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-6 block text-center">
            My Approach
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-16 text-center">
            How We Create Magic
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "1. Discovery & Vision",
                desc: "We start by understanding your brand, your goals, and the exact emotion you want to evoke. We build a mood board and a rock-solid creative direction."
              },
              {
                title: "2. The Production",
                desc: "On set, we create a relaxed, professional environment. Utilizing top-tier cinematic equipment, we execute the vision with precision and adaptability."
              },
              {
                title: "3. The Polish",
                desc: "The magic happens in the edit. We apply custom color grading, meticulous retouching, and sound design to ensure the final product is flawless."
              }
            ].map((step, idx) => (
              <div key={idx} className="p-10 rounded-[2rem] bg-white/[0.01] border border-white/[0.05] hover:border-gold/30 transition-colors">
                <CheckCircle weight="fill" className="h-8 w-8 text-gold mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{step.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Call to Action */}
        <div className="flex flex-col items-center justify-center text-center pt-20 border-t border-white/5">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-8">
            Ready to capture <span className="text-gold">Your Story?</span>
          </h2>
          <Link 
            href="/contact"
            className="h-16 px-12 rounded-full bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-gold transition-all duration-500 flex items-center gap-3 group"
          >
            Start a Conversation
            <ArrowRight weight="bold" className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  )
}
