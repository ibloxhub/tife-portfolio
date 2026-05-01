'use client'

import Link from 'next/link'
import { InstagramLogo, TiktokLogo, YoutubeLogo, XLogo, EnvelopeSimple } from '@phosphor-icons/react'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const socialIconMap: Record<string, React.ElementType> = {
  instagram: InstagramLogo,
  tiktok: TiktokLogo,
  youtube: YoutubeLogo,
  x: XLogo,
  twitter: XLogo,
}

interface PublicFooterProps {
  siteName: string
  tagline: string
  contactEmail: string
  socialLinks: Record<string, string>
}

export function PublicFooter({ siteName, tagline, contactEmail, socialLinks }: PublicFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-white/[0.06]">
      {/* Gold accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white">
              {siteName}
            </h3>
            {tagline && (
              <p className="text-sm text-white/30 leading-relaxed max-w-xs">
                {tagline}
              </p>
            )}
          </div>

          {/* Column 2 — Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/40 hover:text-gold transition-colors duration-500 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 — Social + Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Connect
            </h4>

            {/* Social Icons */}
            {Object.keys(socialLinks).length > 0 && (
              <div className="flex items-center gap-3">
                {Object.entries(socialLinks).map(([platform, url]) => {
                  const Icon = socialIconMap[platform.toLowerCase()]
                  if (!Icon || !url) return null
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-gold hover:border-gold/30 hover:bg-gold/[0.05] transition-all duration-500"
                      aria-label={platform}
                    >
                      <Icon weight="bold" className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            )}

            {/* Contact Email */}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-2 text-sm text-white/40 hover:text-gold transition-colors duration-500 w-fit"
              >
                <EnvelopeSimple weight="bold" className="h-4 w-4" />
                {contactEmail}
              </a>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/15">
            © {year} {siteName}. All rights reserved.
          </p>
          <button
            onClick={() => typeof window !== 'undefined' && window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/15 hover:text-gold transition-colors duration-500 cursor-pointer"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
