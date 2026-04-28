'use client'

import { useEffect, useCallback } from 'react'
import { X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface AdminModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

const maxWidthMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function AdminModal({ isOpen, onClose, title, subtitle, children, maxWidth = 'lg' }: AdminModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative w-full mx-4 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300',
          maxWidthMap[maxWidth]
        )}
      >
        <div className="rounded-[2.5rem] bg-white/[0.03] p-[1px] border border-white/[0.08] backdrop-blur-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden relative">
           {/* Top accent line */}
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-50" />
           
          <div className="rounded-[calc(2.5rem-1px)] bg-black/80 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-8 pb-4">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-2xl font-bold text-white tracking-tight leading-none">{title}</h2>
                {subtitle && <p className="text-xs font-bold text-gold-light/40 uppercase tracking-[0.2em]">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="h-10 w-10 rounded-2xl flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 transition-all border border-white/5"
              >
                <X weight="bold" className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 pt-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
