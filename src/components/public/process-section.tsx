import { ChatCenteredText, PencilLine, Camera, RocketLaunch } from '@phosphor-icons/react/dist/ssr'

export function ProcessSection() {
  const steps = [
    {
      title: 'Reach Out',
      desc: 'Share your vision with our team via the contact form or a quick call.',
      icon: ChatCenteredText,
    },
    {
      title: 'Plan & Prep',
      desc: 'We align on every detail — location, moodboard, timeline, and creative direction.',
      icon: PencilLine,
    },
    {
      title: 'The Shoot',
      desc: 'Our team brings your vision to life with signature cinematic precision.',
      icon: Camera,
    },
    {
      title: 'Delivery',
      desc: 'You receive beautifully edited, delivery-ready digital content — on time, every time.',
      icon: RocketLaunch,
    },
  ]

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-y-1/2 hidden md:block" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-4 block">
            The Process
          </span>
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white">
            How We Work
          </h2>
          <p className="mt-6 text-white/30 text-sm max-w-lg mx-auto leading-relaxed">
            From first message to final delivery, you will always know exactly where your project stands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative z-10">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center md:items-start text-center md:text-left gap-6 group">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-[#0D0D0F] border border-white/10 flex items-center justify-center text-gold group-hover:border-gold/50 group-hover:shadow-[0_0_20px_rgba(200,169,126,0.2)] transition-all duration-500">
                  <step.icon weight="bold" className="h-7 w-7" />
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gold text-black text-[10px] font-bold flex items-center justify-center">
                  0{i + 1}
                </div>
              </div>

              <div className="flex flex-col gap-3 max-w-xs">
                <h3 className="text-xl font-bold text-white tracking-tight uppercase">
                  {step.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
