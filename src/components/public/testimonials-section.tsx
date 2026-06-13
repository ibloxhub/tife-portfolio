'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "The team captured our wedding with a cinematic quality we had only ever seen in films. Every emotion, perfectly preserved.",
      author: "Sarah M.",
      context: "Wedding Film"
    },
    {
      quote: "Exceptional professionalism and an incredible creative eye. The final brand film exceeded every expectation we had.",
      author: "James K.",
      context: "Brand Campaign"
    },
    {
      quote: "The visual storytelling is in a league of its own. Every frame felt like a scene from an award-winning production.",
      author: "Priya R.",
      context: "Editorial Shoot"
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [testimonials.length, isPaused])

  return (
    <section className="py-32 overflow-hidden bg-white/[0.01]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-24">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-4 block">
            Kind Words
          </span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
            Client Stories
          </h2>
          <p className="mt-6 text-white/25 text-sm max-w-md mx-auto leading-relaxed">
            We measure success by one thing: whether you would recommend us to someone you love.
          </p>
        </div>

        {/* 3D Carousel */}
        <div
          className="relative h-[400px] flex items-center justify-center perspective-[1000px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {testimonials.map((t, i) => {
            let offset = i - currentIndex
            if (offset < -1) offset += testimonials.length
            if (offset > 1) offset -= testimonials.length

            const isActive = offset === 0
            const isLeft = offset === -1
            const isRight = offset === 1

            let zIndex = 0
            let transform = 'translateX(0) scale(0.8) rotateY(0deg)'
            let opacity = 'opacity-0 pointer-events-none'

            if (isActive) {
              zIndex = 30; transform = 'translateX(0) scale(1) rotateY(0deg)'; opacity = 'opacity-100 pointer-events-auto'
            } else if (isLeft) {
              zIndex = 20; transform = 'translateX(-60%) scale(0.85) rotateY(-20deg)'; opacity = 'opacity-0 md:opacity-30 pointer-events-none'
            } else if (isRight) {
              zIndex = 20; transform = 'translateX(60%) scale(0.85) rotateY(20deg)'; opacity = 'opacity-0 md:opacity-30 pointer-events-none'
            }

            return (
              <div
                key={i}
                className={cn(
                  "absolute top-0 bottom-0 m-auto h-fit w-full max-w-2xl p-10 md:p-16 rounded-[3rem] bg-[#0D0D0F] border border-white/10 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col items-center text-center gap-8 shadow-2xl",
                  opacity
                )}
                style={{ transform, zIndex, transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,126,0.03)_0%,transparent_80%)] rounded-[3rem] pointer-events-none" />
                <p className="relative z-10 text-xl md:text-3xl text-white/80 font-light italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="relative z-10 flex flex-col gap-2 mt-4">
                  <span className="text-sm font-bold text-white uppercase tracking-widest">{t.author}</span>
                  <span className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">{t.context}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-4 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                i === currentIndex ? "w-12 bg-gold" : "w-4 bg-white/20"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
