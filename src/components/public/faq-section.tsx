'use client'

import { useState } from 'react'
import { Plus, Minus } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'How far in advance should I book?',
    a: 'We recommend reaching out at least 4–8 weeks before your project date for most shoots. For weddings and large productions, 3–6 months ensures we can give your project the full attention it deserves. That said — if you have a tight timeline, reach out anyway. We will always try to make it work.',
  },
  {
    q: 'Do you travel for projects?',
    a: 'Absolutely. We are available for projects worldwide. Travel and accommodation costs are factored into the project quote transparently — no hidden fees. Some of our most memorable work has been shot thousands of miles from home.',
  },
  {
    q: 'What does the final delivery include?',
    a: 'Every project includes fully edited, colour-graded deliverables in your required formats and resolutions (up to 6K). You will receive a private online gallery or delivery link, with files optimised for both web and broadcast use. Full commercial usage rights are included as standard.',
  },
  {
    q: 'How long does post-production take?',
    a: 'Turnaround depends on the scope of the project. Photography edits are typically delivered within 7–14 days. Video productions range from 2–6 weeks depending on complexity. We agree on a firm delivery date before production begins — and we honour it.',
  },
  {
    q: 'Can I request revisions?',
    a: 'Yes. Every project includes structured revision rounds so you have the opportunity to refine the final output. We walk you through the edit together, gather your feedback, and deliver a final version you are completely proud of.',
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-4 block">
            Questions
          </span>
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white">
            Frequently Asked
          </h2>
          <p className="mt-6 text-white/30 text-sm leading-relaxed">
            Everything you need to know before we start creating together.
          </p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={faq.q}
                className={cn(
                  'rounded-[2rem] border transition-all duration-500 overflow-hidden',
                  isOpen
                    ? 'bg-white/[0.04] border-gold/30'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/20'
                )}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-6 p-8 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className={cn(
                    'text-base md:text-lg font-bold tracking-tight transition-colors duration-300',
                    isOpen ? 'text-white' : 'text-white/70 group-hover:text-white'
                  )}>
                    {faq.q}
                  </span>
                  <div className={cn(
                    'flex-shrink-0 h-8 w-8 rounded-full border flex items-center justify-center transition-all duration-500',
                    isOpen
                      ? 'bg-gold border-gold text-black'
                      : 'border-white/20 text-white/40 group-hover:border-white/40'
                  )}>
                    {isOpen
                      ? <Minus weight="bold" className="h-4 w-4" />
                      : <Plus weight="bold" className="h-4 w-4" />
                    }
                  </div>
                </button>

                {/* Answer */}
                <div className={cn(
                  'transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]',
                  isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                )}>
                  <p className="px-8 pb-8 text-white/50 leading-relaxed text-sm md:text-base font-light">
                    {faq.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom nudge */}
        <p className="mt-16 text-center text-white/20 text-sm">
          Still have questions?{' '}
          <a href="/contact" className="text-gold hover:text-white transition-colors duration-300 underline underline-offset-4">
            Reach out directly — we respond within 24 hours.
          </a>
        </p>
      </div>
    </section>
  )
}
