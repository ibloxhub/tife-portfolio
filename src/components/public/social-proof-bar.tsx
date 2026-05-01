export function SocialProofBar() {
  const stats = [
    { label: 'Projects Completed', value: '150+' },
    { label: 'Years Experience', value: '5+' },
    { label: 'Happy Clients', value: '50+' },
    { label: 'Location', value: 'Lagos, NG' },
  ]

  return (
    <section className="relative z-10 -mt-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden relative group">
          {/* Subtle gold glow on hover */}
          <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {stats.map((stat, i) => (
              <div 
                key={stat.label} 
                className="flex flex-col gap-2 text-center md:text-left border-white/5 md:border-r last:border-r-0 md:pr-8"
              >
                <span className="text-2xl sm:text-3xl font-bold text-gold tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 whitespace-nowrap">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
