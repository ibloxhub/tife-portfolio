'use client'

import { WhatsappLogo } from '@phosphor-icons/react'

interface WhatsAppButtonProps {
  phoneNumber: string
}

export function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
  // Clean number — remove spaces, dashes, plus signs for the API link
  const cleanNumber = phoneNumber.replace(/[\s\-+]/g, '')
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=Hi%20there!%20I%27d%20like%20to%20discuss%20a%20project.`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="relative">
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl group-hover:bg-emerald-500/30 transition-all duration-700 scale-150" />

        {/* Button */}
        <div className="relative h-14 w-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-[0_8px_24px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all duration-500">
          <WhatsappLogo weight="fill" className="h-7 w-7" />
        </div>

        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-2xl border-2 border-emerald-500/30 animate-ping" />
      </div>
    </a>
  )
}
