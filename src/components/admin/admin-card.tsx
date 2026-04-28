import { cn } from '@/lib/utils'

interface AdminCardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

const paddingMap = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function AdminCard({ children, className, padding = 'md' }: AdminCardProps) {
  return (
    <div className="rounded-[2.5rem] bg-white/[0.03] p-[1px] border border-white/[0.08] backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div
        className={cn(
          'rounded-[calc(2.5rem-1px)] bg-black/40',
          paddingMap[padding],
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

interface AdminCardCompactProps {
  children: React.ReactNode
  className?: string
}

export function AdminCardCompact({ children, className }: AdminCardCompactProps) {
  return (
    <div className="rounded-[1.5rem] bg-white/[0.03] p-[1px] border border-white/[0.08] backdrop-blur-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group">
       {/* Top accent line */}
       <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-700" />
      
      <div
        className={cn(
          'rounded-[calc(1.5rem-1px)] bg-black/40',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
