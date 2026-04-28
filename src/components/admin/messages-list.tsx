'use client'

import { useState } from 'react'
import { MagnifyingGlass, Envelope } from '@phosphor-icons/react'
import { AdminBadge } from '@/components/admin/admin-badge'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'
import { AdminConfirmDialog } from '@/components/admin/admin-confirm-dialog'
import { MessageDetail } from '@/components/admin/message-detail'
import { useToast } from '@/components/admin/admin-toast'
import { updateContactStatusAction, deleteContactAction } from '@/app/(admin)/admin/actions/contacts.actions'
import { cn } from '@/lib/utils'
import type { Contact } from '@/lib/services/types'

type StatusTab = 'all' | 'new' | 'read' | 'replied' | 'archived'

interface MessagesListProps {
  initialContacts: Contact[]
}

export function MessagesList({ initialContacts }: MessagesListProps) {
  const { showToast } = useToast()
  const [contacts, setContacts] = useState(initialContacts)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<StatusTab>('all')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter
  const filtered = contacts.filter((c) => {
    if (activeTab !== 'all' && c.status !== activeTab) return false
    if (search) {
      const q = search.toLowerCase()
      if (!c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false
    }
    return true
  })

  // Tab counts
  const counts = {
    all: contacts.length,
    new: contacts.filter((c) => c.status === 'new').length,
    read: contacts.filter((c) => c.status === 'read').length,
    replied: contacts.filter((c) => c.status === 'replied').length,
    archived: contacts.filter((c) => c.status === 'archived').length,
  }

  // Status update
  async function handleStatusChange(id: string, status: 'new' | 'read' | 'replied' | 'archived') {
    const prev = contacts.find((c) => c.id === id)
    if (!prev) return

    // Optimistic
    setContacts((list) => list.map((c) => (c.id === id ? { ...c, status } : c)))
    if (selectedContact?.id === id) {
      setSelectedContact({ ...selectedContact, status })
    }

    const result = await updateContactStatusAction(id, status)
    if (result.error) {
      setContacts((list) => list.map((c) => (c.id === id ? { ...c, status: prev.status } : c)))
      showToast(typeof result.error === 'string' ? result.error : 'Failed to update', 'error')
    } else {
      showToast(`Marked as ${status}`)
    }
  }

  // Delete
  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    const result = await deleteContactAction(deleteTarget.id)
    if (result.error) {
      showToast(typeof result.error === 'string' ? result.error : 'Failed to delete', 'error')
    } else {
      setContacts((list) => list.filter((c) => c.id !== deleteTarget.id))
      if (selectedContact?.id === deleteTarget.id) setSelectedContact(null)
      showToast('Message deleted')
    }
    setIsDeleting(false)
    setDeleteTarget(null)
  }

  // Time ago helper
  function timeAgo(dateStr: string) {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  function getInitials(name: string) {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const tabs: { key: StatusTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'read', label: 'Read' },
    { key: 'replied', label: 'Replied' },
    { key: 'archived', label: 'Archived' },
  ]

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 p-0.5 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'h-9 px-3 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5',
                activeTab === tab.key
                  ? 'bg-white/10 text-white'
                  : 'text-text-muted hover:text-white'
              )}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full',
                  tab.key === 'new' && counts.new > 0
                    ? 'bg-gold/20 text-gold-light'
                    : 'bg-white/5 text-text-muted'
                )}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <MagnifyingGlass weight="light" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-xl bg-white/5 border border-white/10 pl-9 pr-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors"
          />
        </div>
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={Envelope}
          title="No messages"
          description={search || activeTab !== 'all' ? 'Try adjusting your filters.' : 'Messages from your contact form will appear here.'}
        />
      ) : (
        <div className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5 backdrop-blur-sm">
          <div className="rounded-[calc(2rem-0.375rem)] bg-surface shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden">
            <div className="divide-y divide-white/[0.03]">
              {filtered.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact)
                    // Auto-mark as read when opened
                    if (contact.status === 'new') {
                      handleStatusChange(contact.id, 'read')
                    }
                  }}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 md:p-5 text-left hover:bg-white/[0.02] transition-colors group',
                    contact.status === 'new' && 'bg-gold/[0.02]'
                  )}
                >
                  {/* Avatar */}
                  <div className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-xs font-medium',
                    contact.status === 'new'
                      ? 'bg-gold/10 text-gold-light ring-1 ring-gold/20'
                      : 'bg-white/5 text-text-secondary'
                  )}>
                    {getInitials(contact.name)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={cn(
                        'text-sm truncate',
                        contact.status === 'new' ? 'font-semibold text-white' : 'font-medium text-white'
                      )}>
                        {contact.name}
                      </span>
                      <AdminBadge variant="status" status={contact.status}>
                        {contact.status}
                      </AdminBadge>
                    </div>
                    <p className="text-xs text-text-muted truncate">
                      {contact.service_name ? `${contact.service_name} · ` : ''}
                      {contact.message.slice(0, 80)}{contact.message.length > 80 ? '...' : ''}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[11px] text-text-muted">{timeAgo(contact.created_at)}</span>
                    {contact.status === 'new' && (
                      <div className="h-2 w-2 rounded-full bg-gold" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedContact && (
        <MessageDetail
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onStatusChange={(status) => handleStatusChange(selectedContact.id, status)}
          onDelete={() => {
            setDeleteTarget(selectedContact)
            setSelectedContact(null)
          }}
        />
      )}

      {/* Delete Confirmation */}
      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        description={`Are you sure you want to delete the message from "${deleteTarget?.name}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  )
}
