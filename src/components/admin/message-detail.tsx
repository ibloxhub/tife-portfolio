'use client'

import { X, EnvelopeSimple, WhatsappLogo, Trash, CheckCircle, Archive, ArrowCounterClockwise } from '@phosphor-icons/react'
import { AdminBadge } from '@/components/admin/admin-badge'
import { cn } from '@/lib/utils'
import type { Contact } from '@/lib/services/types'

interface MessageDetailProps {
  contact: Contact
  onClose: () => void
  onStatusChange: (status: 'new' | 'read' | 'replied' | 'archived') => void
  onDelete: () => void
}

export function MessageDetail({ contact, onClose, onStatusChange, onDelete }: MessageDetailProps) {
  const date = new Date(contact.created_at)
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  // Build mailto link
  const mailtoLink = `mailto:${contact.email}?subject=Re: Your inquiry${contact.service_name ? ` about ${contact.service_name}` : ''}&body=Hi ${contact.name},%0D%0A%0D%0AThank you for reaching out!%0D%0A%0D%0A`

  // Build WhatsApp link
  const whatsappMessage = `Hi ${contact.name}! Thank you for your inquiry${contact.service_name ? ` about ${contact.service_name}` : ''}. I'd love to discuss this further with you.`
  const whatsappLink = contact.phone
    ? `https://wa.me/${contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`
    : null

  const statusActions: { status: 'read' | 'replied' | 'archived'; label: string; icon: typeof CheckCircle }[] = [
    { status: 'read', label: 'Mark Read', icon: CheckCircle },
    { status: 'replied', label: 'Mark Replied', icon: ArrowCounterClockwise },
    { status: 'archived', label: 'Archive', icon: Archive },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-2xl mx-4 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5 backdrop-blur-xl">
          <div className="rounded-[calc(2rem-0.375rem)] bg-surface shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] max-h-[85vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'h-12 w-12 rounded-full flex items-center justify-center text-sm font-medium',
                  contact.status === 'new'
                    ? 'bg-gold/10 text-gold-light ring-1 ring-gold/20'
                    : 'bg-white/5 text-text-secondary'
                )}>
                  {contact.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-lg font-medium text-white">{contact.name}</h2>
                  <p className="text-xs text-text-muted">{contact.email}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 transition-colors"
              >
                <X weight="light" className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-3">
                <AdminBadge variant="status" status={contact.status}>
                  {contact.status}
                </AdminBadge>
                {contact.service_name && (
                  <span className="text-xs text-text-muted bg-white/5 rounded-full px-2.5 py-1">
                    {contact.service_name}
                  </span>
                )}
                <span className="text-xs text-text-muted">
                  {formattedDate} at {formattedTime}
                </span>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-black/30 border border-white/5 p-3">
                  <span className="text-[10px] text-text-muted uppercase tracking-widest">Email</span>
                  <p className="text-sm text-white mt-1">{contact.email}</p>
                </div>
                {contact.phone && (
                  <div className="rounded-xl bg-black/30 border border-white/5 p-3">
                    <span className="text-[10px] text-text-muted uppercase tracking-widest">Phone</span>
                    <p className="text-sm text-white mt-1">{contact.phone}</p>
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="rounded-xl bg-black/30 border border-white/5 p-4">
                <span className="text-[10px] text-text-muted uppercase tracking-widest">Message</span>
                <p className="text-sm text-white mt-2 leading-relaxed whitespace-pre-wrap">{contact.message}</p>
              </div>

              {/* Reply Actions */}
              <div className="flex flex-wrap gap-2">
                <a
                  href={mailtoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onStatusChange('replied')}
                  className="h-10 px-4 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-all flex items-center gap-2"
                >
                  <EnvelopeSimple weight="light" className="h-4 w-4" />
                  Reply via Email
                </a>
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onStatusChange('replied')}
                    className="h-10 px-4 rounded-xl bg-green-600/20 text-green-400 text-sm font-medium border border-green-600/20 hover:bg-green-600/30 transition-colors flex items-center gap-2"
                  >
                    <WhatsappLogo weight="fill" className="h-4 w-4" />
                    Reply via WhatsApp
                  </a>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between p-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                {statusActions
                  .filter((a) => a.status !== contact.status)
                  .map((action) => (
                    <button
                      key={action.status}
                      onClick={() => onStatusChange(action.status)}
                      className="h-9 px-3 rounded-xl bg-white/5 text-text-secondary text-xs font-medium hover:bg-white/10 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <action.icon weight="light" className="h-3.5 w-3.5" />
                      {action.label}
                    </button>
                  ))}
              </div>
              <button
                onClick={onDelete}
                className="h-9 px-3 rounded-xl bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
              >
                <Trash weight="light" className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
