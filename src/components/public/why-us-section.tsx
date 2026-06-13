import { FilmSlate, Handshake, Timer } from '@phosphor-icons/react/dist/ssr'

const pillars = [
  {
    icon: FilmSlate,
    title: 'Cinema-Grade Production',
    desc: 'We use the same equipment trusted on major film sets — RED, ARRI, and Zeiss glass. Your project deserves nothing less.',
    detail: 'Full lighting rigs · Stabilised gimbal systems · 6K RAW capture',
  },
  {
    icon: Handshake,
    title: 'Dedicated Creative Partnership',
    desc: 'One point of contact from brief to delivery. We immerse ourselves in your vision before a single frame is shot.',
    detail: 'Moodboard development · On-set direction · Revision rounds included',
  },
  {
    icon: Timer,
    title: 'On-Time Delivery. Guaranteed.',
    desc: 'Your deadline is our deadline — without exception. We build every production timeline backwards from your launch date.',
    detail: 'Progress updates · Milestone check-ins · No surprise delays',
  },
]

export function WhyUsSection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,169,126,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-4 block">
            Why IBlox
          </span>
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white">
            What Makes Us Different
          </h2>
          <p className="mt-6 text-white/30 text-sm max-w-xl mx-auto leading-relaxed">
            A lot of studios can point a camera. We build visual experiences that move people to act.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className="group relative p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.06] hover:border-gold/40 hover:bg-gold/[0.02] transition-all duration-700 overflow-hidden flex flex-col gap-8"
            >
              {/* Corner glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 blur-[60px] rounded-full -mr-20 -mt-20 group-hover:bg-gold/10 transition-colors duration-700" />

              {/* Number */}
              <span className="text-[10px] font-bold text-gold/40 tracking-[0.3em] uppercase">
                0{i + 1}
              </span>

              {/* Icon */}
              <div className="h-16 w-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black group-hover:scale-110 transition-all duration-500">
                <pillar.icon weight="bold" className="h-8 w-8" />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
                  {pillar.title}
                </h3>
                <p className="text-white/50 leading-relaxed text-sm">
                  {pillar.desc}
                </p>
              </div>

              {/* Detail tags */}
              <div className="mt-auto pt-6 border-t border-white/[0.06]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold/50 leading-loose">
                  {pillar.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
