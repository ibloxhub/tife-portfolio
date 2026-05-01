'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { submitContactAction } from '@/lib/actions/contacts.actions'
import { cn } from '@/lib/utils'
import { CheckCircle, PaperPlaneTilt, Spinner, CaretDown } from '@phosphor-icons/react'

interface PublicContactFormProps {
  services: string[]
}

export function PublicContactForm({ services }: PublicContactFormProps) {
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_id: '',
    message: '',
  })

  // Pre-select service from URL
  useEffect(() => {
    const serviceName = searchParams.get('service')
    if (serviceName && services.includes(serviceName)) {
      setFormData(prev => ({ ...prev, service_id: serviceName }))
    }
  }, [searchParams, services])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitContactAction(formData as any)
      
      if (!result.success) {
        setError(result.error || 'Failed to submit')
      } else {
        setIsSuccess(true)
        setFormData({ name: '', email: '', phone: '', service_id: '', message: '' })
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-700">
        <div className="h-20 w-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-8">
          <CheckCircle weight="fill" className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-bold text-white uppercase tracking-tight mb-4">Message Sent Successfully</h2>
        <p className="text-white/40 max-w-md leading-relaxed">
          Thank you for reaching out. I have received your inquiry and will get back to you within 24-48 hours.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="mt-10 text-[10px] font-bold uppercase tracking-[0.3em] text-gold hover:text-white transition-colors"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-4">Your Name</label>
          <input
            required
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="h-12 px-6 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/10 focus:border-gold/50 focus:bg-white/[0.05] outline-none transition-all"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-4">Email Address</label>
          <input
            required
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="h-12 px-6 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/10 focus:border-gold/50 focus:bg-white/[0.05] outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Phone */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-4">Phone Number (Optional)</label>
          <input
            type="tel"
            placeholder="+234 ..."
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="h-12 px-6 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/10 focus:border-gold/50 focus:bg-white/[0.05] outline-none transition-all"
          />
        </div>

        {/* Service - Custom Premium Dropdown */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-4">Service Interested In</label>
          
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={cn(
              "h-12 px-6 rounded-2xl border text-left flex items-center justify-between transition-all outline-none",
              dropdownOpen ? "bg-white/[0.05] border-gold/50 text-white" : "bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.05]",
              !formData.service_id && "text-white/40"
            )}
          >
            <span className="truncate">{formData.service_id || 'Select a Service'}</span>
            <CaretDown weight="bold" className={cn("h-4 w-4 transition-transform duration-300", dropdownOpen && "rotate-180 text-gold")} />
          </button>

          {/* Custom Dropdown Options */}
          {dropdownOpen && (
            <div className="absolute top-[78px] left-0 right-0 z-50 bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                {services.map((s, idx) => (
                  <button
                    key={`${s}-${idx}`}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, service_id: s })
                      setDropdownOpen(false)
                    }}
                    className={cn(
                      "w-full text-left px-6 py-4 text-sm transition-colors hover:bg-white/5",
                      formData.service_id === s ? "text-gold bg-gold/5" : "text-white/70"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-4">Your Message</label>
        <textarea
          required
          rows={5}
          placeholder="Tell me about your vision..."
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
          className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/10 focus:border-gold/50 focus:bg-white/[0.05] outline-none transition-all resize-none"
        />
      </div>

      {error && (
        <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>
      )}

      <button
        disabled={isSubmitting}
        type="submit"
        className="mt-2 h-14 w-full rounded-full bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold transition-all duration-500 flex items-center justify-center gap-3 group disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Spinner className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Send Message
            <PaperPlaneTilt weight="bold" className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  )
}
