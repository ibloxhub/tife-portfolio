'use client'

import { useState, useRef, useEffect } from 'react'
import { CaretDown, Check } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

// --- Text Input ---
interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helper?: string
}

export function AdminInput({ label, error, helper, className, id, ...props }: AdminInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-2 group">
      <label htmlFor={inputId} className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-focus-within:text-gold transition-colors duration-500">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={cn(
            'flex h-12 w-full rounded-2xl border bg-white/[0.03] px-4 py-3 text-sm text-white transition-all duration-500',
            'border-white/[0.08] placeholder:text-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/50 focus-visible:border-gold focus-visible:bg-white/[0.05]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500/50 focus-visible:ring-red-500/50 focus-visible:border-red-500',
            className
          )}
          {...props}
        />
        {/* Subtle inner glow on focus */}
        <div className="absolute inset-0 rounded-2xl bg-gold/[0.02] opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-1000" />
      </div>
      {error && <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">{error}</p>}
      {helper && !error && <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest leading-relaxed">{helper}</p>}
    </div>
  )
}

// --- Textarea ---
interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  helper?: string
}

export function AdminTextarea({ label, error, helper, className, id, ...props }: AdminTextareaProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-2 group">
      <label htmlFor={inputId} className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-focus-within:text-gold transition-colors duration-500">
        {label}
      </label>
      <div className="relative">
        <textarea
          id={inputId}
          className={cn(
            'flex min-h-[140px] w-full rounded-2xl border bg-white/[0.03] px-4 py-3 text-sm text-white transition-all duration-500 resize-y',
            'border-white/[0.08] placeholder:text-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/50 focus-visible:border-gold focus-visible:bg-white/[0.05]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500/50 focus-visible:ring-red-500/50 focus-visible:border-red-500',
            className
          )}
          {...props}
        />
        <div className="absolute inset-0 rounded-2xl bg-gold/[0.02] opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-1000" />
      </div>
      {error && <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">{error}</p>}
      {helper && !error && <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest leading-relaxed">{helper}</p>}
    </div>
  )
}

// --- Custom Select (Luxury Dropdown) ---
interface AdminSelectProps {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
  value: string
  onChange: (e: { target: { value: string } }) => void
  id?: string
  className?: string
  required?: boolean
}

export function AdminSelect({ label, error, options, placeholder, value, onChange, className, id }: AdminSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find(opt => opt.value === value)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex flex-col gap-2 group" ref={containerRef}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-focus-within:text-gold transition-colors duration-500">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex h-12 w-full items-center justify-between rounded-2xl border bg-white/[0.03] px-4 py-3 text-sm text-white transition-all duration-500',
            'border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]',
            isOpen ? 'ring-1 ring-gold/50 border-gold bg-white/[0.05]' : 'hover:border-white/20',
            error && 'border-red-500/50 ring-red-500/50',
            className
          )}
        >
          <span className={cn(
            "truncate",
            !selectedOption ? "text-white/10" : "text-white"
          )}>
            {selectedOption ? selectedOption.label : placeholder || 'Select an option'}
          </span>
          <CaretDown 
            weight="bold" 
            className={cn(
              "h-4 w-4 text-white/20 transition-transform duration-500",
              isOpen ? "rotate-180 text-gold" : ""
            )} 
          />
        </button>

        {/* Dropdown Popover */}
        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-[2rem] bg-[#050505]/95 border border-white/10 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange({ target: { value: opt.value } } as any)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex items-center justify-between w-full h-11 px-4 rounded-xl text-sm transition-all duration-300 group/item",
                    opt.value === value 
                      ? "bg-gold/10 text-gold font-bold" 
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span>{opt.label}</span>
                  {opt.value === value && <Check weight="bold" className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {error && <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">{error}</p>}
    </div>
  )
}

// --- Toggle Switch ---
interface AdminToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
  disabled?: boolean
}

export function AdminToggle({ label, checked, onChange, description, disabled }: AdminToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-2">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-bold text-white tracking-tight uppercase">{label}</span>
        {description && <span className="text-[10px] font-medium text-white/30 uppercase tracking-widest">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border border-white/10 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-4 focus-visible:ring-offset-black',
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-gold shadow-[0_0_20px_rgba(200,169,126,0.4)]' : 'bg-white/5'
        )}
      >
        <span
          className={cn(
            'pointer-events-none absolute top-0.5 left-0.5 h-5.5 w-5.5 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
            checked ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white/40'
          )}
        />
      </button>
    </div>
  )
}
