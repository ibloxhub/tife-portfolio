import { ArrowUpRight, ArrowDownRight } from '@phosphor-icons/react/dist/ssr'
import type { Icon } from '@phosphor-icons/react'

interface AdminStatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
  }
  icon?: Icon
}

export function AdminStatCard({ title, value, subtitle, trend, icon: IconComponent }: AdminStatCardProps) {
  return (
    <div className="rounded-[2rem] bg-white/[0.03] p-[1px] border border-white/[0.08] backdrop-blur-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group">
      {/* Subtle inner ambient glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-gold/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      <div className="rounded-[calc(2rem-1px)] bg-black/40 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between text-white/40">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{title}</span>
          {trend && trend.direction === 'up' && (
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500/10 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
               <ArrowUpRight weight="bold" className="h-4 w-4 text-green-400" />
            </div>
          )}
          {trend && trend.direction === 'down' && (
             <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-500/10 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
               <ArrowDownRight weight="bold" className="h-4 w-4 text-red-400" />
             </div>
          )}
          {IconComponent && !trend && (
            <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20 shadow-[0_0_10px_rgba(200,169,126,0.1)]">
              <IconComponent weight="light" className="h-4 w-4 text-gold" />
            </div>
          )}
        </div>
        <div className="flex items-end gap-3">
          <span className="text-4xl font-bold text-white tracking-tighter">{value}</span>
          {trend && (
            <span
              className={`text-[11px] font-bold mb-1.5 px-2 py-0.5 rounded-md border ${
                trend.direction === 'up'
                  ? 'text-green-400 bg-green-400/5 border-green-400/10'
                  : trend.direction === 'down'
                  ? 'text-red-400 bg-red-400/5 border-red-400/10'
                  : 'text-text-muted bg-white/5 border-white/10'
              }`}
            >
              {trend.value}
            </span>
          )}
          {subtitle && !trend && (
            <span className="text-xs font-medium text-white/30 mb-1.5 uppercase tracking-wider">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  )
}
