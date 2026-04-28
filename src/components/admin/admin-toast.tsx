'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 min-w-[300px] max-w-[400px] shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300',
              'ring-1 backdrop-blur-xl',
              toast.type === 'success'
                ? 'bg-surface ring-green-500/20'
                : 'bg-surface ring-red-500/20'
            )}
          >
            {toast.type === 'success' ? (
              <CheckCircle weight="fill" className="h-5 w-5 text-green-400 shrink-0" />
            ) : (
              <XCircle weight="fill" className="h-5 w-5 text-red-400 shrink-0" />
            )}
            <span className="text-sm text-white flex-1">{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              className="h-6 w-6 rounded-full flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 transition-colors shrink-0"
            >
              <X weight="light" className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
