import { cn } from '@/lib/utils'

type ContactStatus = 'new' | 'read' | 'replied' | 'archived'
type PortfolioCategory = 'photo' | 'video' | 'event' | 'marketing'

const statusStyles: Record<ContactStatus, string> = {
  new: 'bg-gold/20 text-gold-light border-gold/30 font-bold',
  read: 'bg-white/10 text-white/60 border-white/10 font-medium',
  replied: 'bg-green-500/10 text-green-300 border-green-500/20 font-bold',
  archived: 'bg-white/5 text-text-muted border-white/5 font-medium',
}

const categoryStyles: Record<PortfolioCategory, string> = {
  photo: 'bg-blue-500/10 text-blue-300 border-blue-500/20 font-bold',
  video: 'bg-purple-500/10 text-purple-300 border-purple-500/20 font-bold',
  event: 'bg-amber-500/10 text-amber-300 border-amber-500/20 font-bold',
  marketing: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 font-bold',
}

interface AdminBadgeProps {
  children: React.ReactNode
  variant?: 'status' | 'category' | 'default'
  status?: ContactStatus
  category?: PortfolioCategory
  className?: string
}

export function AdminBadge({ children, variant = 'default', status, category, className }: AdminBadgeProps) {
  let styles = 'bg-white/5 text-text-secondary border-white/10'

  if (variant === 'status' && status) {
    styles = statusStyles[status]
  } else if (variant === 'category' && category) {
    styles = categoryStyles[category]
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full text-[10px] font-medium px-2.5 py-0.5 border tracking-wide uppercase',
        styles,
        className
      )}
    >
      {children}
    </span>
  )
}

interface PublishBadgeProps {
  isPublished: boolean
}

export function PublishBadge({ isPublished }: PublishBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full text-[10px] font-medium px-2.5 py-0.5 border tracking-wide uppercase',
        isPublished
          ? 'bg-green-500/15 text-green-300 border-green-500/30 font-bold'
          : 'bg-white/5 text-text-muted border-white/10'
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          isPublished ? 'bg-green-400' : 'bg-text-muted'
        )}
      />
      {isPublished ? 'Published' : 'Draft'}
    </span>
  )
}
