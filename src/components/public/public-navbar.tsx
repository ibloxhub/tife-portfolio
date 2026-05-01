'use client'

import { useState, useEffect } from 'react'
import { List, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

interface PublicNavbarProps {
  siteName: string
}

export function PublicNavbar({ siteName }: PublicNavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* ── Floating Pill Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4 sm:pt-5">
        <div
          className={cn(
            'mx-auto max-w-6xl flex items-center justify-between h-14 sm:h-16 px-6 sm:px-8 rounded-full border transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
            scrolled
              ? 'bg-black/70 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
              : 'bg-white/[0.03] backdrop-blur-sm border-white/[0.06]'
          )}
        >
          {/* Brand */}
          <Link
            href="/"
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-white hover:text-gold transition-colors duration-500"
          >
            {siteName}
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500',
                    isActive
                      ? 'text-gold bg-gold/[0.08]'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="hidden lg:flex items-center h-9 px-5 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-black hover:shadow-[0_0_20px_rgba(200,169,126,0.3)] transition-all duration-500"
          >
            Book Now
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden h-10 w-10 rounded-full flex items-center justify-center text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X weight="bold" className="h-5 w-5" />
            ) : (
              <List weight="bold" className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile Full-Screen Menu ── */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-8 transition-all duration-700 lg:hidden',
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        {navLinks.map((link, i) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'text-4xl sm:text-5xl font-bold uppercase tracking-tight transition-all duration-500',
                isActive ? 'text-gold' : 'text-white/40 hover:text-white',
              )}
              style={{ transitionDelay: menuOpen ? `${i * 80}ms` : '0ms' }}
            >
              {link.label}
            </Link>
          )
        })}

        {/* Mobile CTA */}
        <Link
          href="/contact"
          onClick={() => setMenuOpen(false)}
          className="mt-4 h-14 px-10 rounded-full bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-gold transition-all duration-500 flex items-center"
        >
          Book Now
        </Link>
      </div>
    </>
  )
}
