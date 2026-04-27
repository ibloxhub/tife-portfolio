'use client'

import { 
  House, 
  Image as ImageIcon, 
  Briefcase, 
  ChartBar, 
  Envelope, 
  Gear,
  SignOut,
  X
} from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/(admin)/admin/login/actions'
import { cn } from '@/lib/utils'

const navItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: House },
  { title: 'Portfolio', url: '/admin/portfolio', icon: ImageIcon },
  { title: 'Services', url: '/admin/services', icon: Briefcase },
  { title: 'Analytics', url: '/admin/analytics', icon: ChartBar },
  { title: 'Messages', url: '/admin/messages', icon: Envelope, badge: '3' },
  { title: 'Settings', url: '/admin/settings', icon: Gear },
]

export function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname()

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform flex flex-col border-r border-white/5 bg-charcoal transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-between px-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gold" />
          <span className="text-xs font-semibold tracking-widest text-gold-light uppercase">Platform</span>
        </div>
        <button 
          className="md:hidden text-text-secondary hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
        <span className="text-text-muted text-[10px] tracking-widest uppercase mb-2 px-3">Main Menu</span>
        
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.url)
          return (
            <Link 
              key={item.title}
              href={item.url}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between h-11 rounded-xl px-4 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                isActive 
                  ? 'bg-white/5 text-gold hover:bg-white/10 hover:text-gold-light' 
                  : 'text-text-secondary hover:bg-white/5 hover:text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon weight={isActive ? 'fill' : 'light'} className="h-5 w-5" />
                <span className="font-medium text-sm">{item.title}</span>
              </div>
              {item.badge && (
                <span className="bg-gold/10 text-gold-light rounded-full text-[10px] px-2 py-0.5 border border-gold/20">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      <div className="p-4 mt-auto">
        <div className="rounded-[1.5rem] bg-white/[0.02] p-1 ring-1 ring-white/5 backdrop-blur-xl">
          <div className="flex items-center justify-between rounded-[calc(1.5rem-0.25rem)] bg-surface p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-charcoal-light flex items-center justify-center border border-white/5">
                <span className="text-xs font-medium text-white">T</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Tife</span>
                <span className="text-[10px] text-text-muted">Admin</span>
              </div>
            </div>
            
            <form action={logout}>
              <button 
                type="submit"
                className="h-8 w-8 rounded-full flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                title="Log out"
              >
                <SignOut weight="light" className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  )
}
