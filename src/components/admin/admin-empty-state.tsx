import type { Icon } from '@phosphor-icons/react'
import { FolderOpen } from '@phosphor-icons/react/dist/ssr'

interface AdminEmptyStateProps {
  icon?: Icon
  title: string
  description: string
  action?: React.ReactNode
}

export function AdminEmptyState({ icon: IconComponent, title, description, action }: AdminEmptyStateProps) {
  const DisplayIcon = IconComponent || FolderOpen

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
        <DisplayIcon weight="light" className="h-8 w-8 text-text-muted" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-6">{description}</p>
      {action}
    </div>
  )
}
