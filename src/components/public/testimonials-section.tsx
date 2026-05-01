'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Tife captured our wedding in a way that makes us relive every emotion. Absolutely breathtaking work.",
      author: "Adaeze",
      context: "Wedding Client"
    },
    {
      quote: "Professional, creative, and has an incredible eye for detail. The final video exceeded all expectations.",
      author: "Segun",
      context: "Brand Project"
    },
    {
      quote: "The visual storytelling is unmatched. Every frame felt like a cinematic masterpiece.",
      author: "Nneka",
      context: "Editorial Shoot"
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-scroll logic (2 seconds, pauses on hover)
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
        </div>

        {/* 3D Carousel Container */}
        <div 
          className="relative h-[400px] flex items-center justify-center perspective-[1000px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {testimonials.map((t, i) => {
            // Calculate relative position to active index
            let offset = i - currentIndex
            if (offset < -1) offset += testimonials.length
            if (offset > 1) offset -= testimonials.length

            const isActive = offset === 0
            const isLeft = offset === -1
            const isRight = offset === 1

            // Determine classes and styles based on position
            let zIndex = 0
            let transform = 'translateX(0) scale(0.8) rotateY(0deg)'
            let opacity = 'opacity-0 pointer-events-none'

            if (isActive) {
              zIndex = 30
              transform = 'translateX(0) scale(1) rotateY(0deg)'
              opacity = 'opacity-100 pointer-events-auto'
            } else if (isLeft) {
              zIndex = 20
              transform = 'translateX(-60%) scale(0.85) rotateY(-20deg)'
              opacity = 'opacity-0 md:opacity-30 pointer-events-none'
            } else if (isRight) {
              zIndex = 20
              transform = 'translateX(60%) scale(0.85) rotateY(20deg)'
              opacity = 'opacity-0 md:opacity-30 pointer-events-none'
            }

            return (
              <div
                key={i}
                className={cn(
                  "absolute top-0 bottom-0 m-auto h-fit w-full max-w-2xl p-10 md:p-16 rounded-[3rem] bg-[#0A0A0A] border border-white/10 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col items-center text-center gap-8 shadow-2xl",
                  opacity
                )}
                style={{
                  transform,
                  zIndex,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,126,0.03)_0%,transparent_80%)] rounded-[3rem] pointer-events-none" />
                <p className="relative z-10 text-xl md:text-3xl text-white/80 font-light italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="relative z-10 flex flex-col gap-2 mt-4">
                  <span className="text-sm font-bold text-white uppercase tracking-widest">
                    {t.author}
                  </span>
                  <span className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">
                    {t.context}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Carousel Indicators */}
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
