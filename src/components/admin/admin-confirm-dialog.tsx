'use client'

import { Warning } from '@phosphor-icons/react'

interface AdminConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  isLoading?: boolean
}

export function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Delete',
  isLoading = false,
}: AdminConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5 backdrop-blur-xl">
          <div className="rounded-[calc(2rem-0.375rem)] bg-surface p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="flex flex-col items-center text-center gap-4">
              {/* Icon */}
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <Warning weight="fill" className="h-6 w-6 text-red-400" />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-medium text-white">{title}</h3>
                <p className="text-sm text-text-muted">{description}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 w-full mt-2">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 h-11 rounded-xl bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex-1 h-11 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Deleting...' : confirmLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
