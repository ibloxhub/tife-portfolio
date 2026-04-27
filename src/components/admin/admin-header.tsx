'use client'

import { List, Bell } from '@phosphor-icons/react'
import { usePathname } from 'next/navigation'

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname()
  
  const pathSegments = pathname.split('/').filter(Boolean)
  const currentPage = pathSegments[pathSegments.length - 1]
  const pageTitle = currentPage ? currentPage.charAt(0).toUpperCase() + currentPage.slice(1) : 'Dashboard'

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-white/5 bg-charcoal/80 px-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden text-text-secondary hover:text-white"
          onClick={onMenuClick}
        >
          <List className="h-6 w-6" />
        </button>
        <div className="h-4 w-px bg-white/10 md:hidden" />
        <h1 className="text-sm font-medium text-white">{pageTitle}</h1>
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        <button className="relative h-8 w-8 rounded-full flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/5 transition-colors">
          <Bell weight="light" className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-gold" />
        </button>
      </div>
    </header>
  )
}
