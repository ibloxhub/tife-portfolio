'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlass, Envelope, Trash, CheckSquare, Square, ArrowCounterClockwise } from '@phosphor-icons/react'
import { AdminBadge } from '@/components/admin/admin-badge'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'
import { AdminConfirmDialog } from '@/components/admin/admin-confirm-dialog'
import { MessageDetail } from '@/components/admin/message-detail'
import { useToast } from '@/components/admin/admin-toast'
import { useRealtimeData } from '@/hooks/use-realtime-data'
import {
  updateContactStatusAction,
  deleteContactAction,
  bulkDeleteContactsAction,
} from '@/app/(admin)/admin/actions/contacts.actions'
import { cn } from '@/lib/utils'
import type { Contact } from '@/lib/services/types'

type StatusTab = 'all' | 'new' | 'read' | 'replied' | 'archived'

interface MessagesListProps {
  initialContacts: Contact[]
}

export function MessagesList({ initialContacts }: MessagesListProps) {
  const { showToast } = useToast()
  const router = useRouter()
  const [contacts, setContacts] = useRealtimeData('contacts', '/api/contact?limit=200', initialContacts, {
    onInsert: (newContact) => {
      setContacts((prev) => {
        if (prev.some((c) => c.id === newContact.id)) return prev
        return [newContact, ...prev]
      })
    },
    onUpdate: (updatedContact) => {
      setContacts((prev) => prev.map((c) => (c.id === updatedContact.id ? updatedContact : c)))
    },
    onDelete: (deletedId) => {
      setContacts((prev) => prev.filter((c) => c.id !== deletedId))
    },
  })
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<StatusTab>('all')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // ── Bulk select state ──────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [showBulkConfirm, setShowBulkConfirm] = useState(false)

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

  const allVisibleSelected = filtered.length > 0 && filtered.every((c) => selectedIds.has(c.id))
  const someSelected = selectedIds.size > 0

  // ── Toggle individual selection ────────────────────────────────────────────
  function toggleSelect(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ── Toggle select all visible ──────────────────────────────────────────────
  function toggleSelectAll() {
    if (allVisibleSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map((c) => c.id)))
    }
  }

  // ── Status update ──────────────────────────────────────────────────────────
  async function handleStatusChange(id: string, status: 'new' | 'read' | 'replied' | 'archived') {
    const prev = contacts.find((c) => c.id === id)
    if (!prev) return
    setContacts((list) => list.map((c) => (c.id === id ? { ...c, status } : c)))
    if (selectedContact?.id === id) setSelectedContact({ ...selectedContact, status })
    const result = await updateContactStatusAction(id, status)
    if (result.error) {
      setContacts((list) => list.map((c) => (c.id === id ? { ...c, status: prev.status } : c)))
      showToast(typeof result.error === 'string' ? result.error : 'Failed to update', 'error')
    } else {
      showToast(`Marked as ${status}`)
    }
  }

  // ── Single delete ──────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    const result = await deleteContactAction(deleteTarget.id)
    if (result.error) {
      showToast(typeof result.error === 'string' ? result.error : 'Failed to delete', 'error')
    } else {
      setContacts((list) => list.filter((c) => c.id !== deleteTarget.id))
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(deleteTarget.id); return n })
      if (selectedContact?.id === deleteTarget.id) setSelectedContact(null)
      showToast('Message deleted')
    }
    setIsDeleting(false)
    setDeleteTarget(null)
  }

  // ── Bulk delete ────────────────────────────────────────────────────────────
  async function handleBulkDelete() {
    setIsBulkDeleting(true)
    const ids = Array.from(selectedIds)
    const result = await bulkDeleteContactsAction(ids)
    if (result.error) {
      showToast(typeof result.error === 'string' ? result.error : 'Failed to delete', 'error')
    } else {
      setContacts((list) => list.filter((c) => !selectedIds.has(c.id)))
      if (selectedContact && selectedIds.has(selectedContact.id)) setSelectedContact(null)
      showToast(`${ids.length} message${ids.length === 1 ? '' : 's'} deleted`)
      setSelectedIds(new Set())
    }
    setIsBulkDeleting(false)
    setShowBulkConfirm(false)
  }

  // ── Bulk mark as read ──────────────────────────────────────────────────────
  async function handleBulkMarkRead() {
    const ids = Array.from(selectedIds)
    setContacts((list) =>
      list.map((c) => (selectedIds.has(c.id) && c.status === 'new' ? { ...c, status: 'read' as const } : c))
    )
    await Promise.all(ids.map((id) => updateContactStatusAction(id, 'read')))
    showToast(`${ids.length} message${ids.length === 1 ? '' : 's'} marked as read`)
    setSelectedIds(new Set())
  }

  // Helpers
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
      {/* ── Bulk Action Toolbar (slides in when items are selected) ── */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-out',
          someSelected ? 'max-h-20 opacity-100 mb-3' : 'max-h-0 opacity-0'
        )}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-2xl bg-gold/10 border border-gold/25 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <CheckSquare weight="fill" className="h-4 w-4 text-gold" />
            <span className="text-sm font-semibold text-white">
              {selectedIds.size} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkMarkRead}
              className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold tracking-wider uppercase text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <ArrowCounterClockwise weight="bold" className="h-3.5 w-3.5" />
              Mark Read
            </button>
            <button
              onClick={() => setShowBulkConfirm(true)}
              className="h-8 px-3 rounded-lg bg-red-500/20 border border-red-500/30 text-[11px] font-bold tracking-wider uppercase text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-colors flex items-center gap-1.5"
            >
              <Trash weight="bold" className="h-3.5 w-3.5" />
              Delete ({selectedIds.size})
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center text-lg leading-none"
              title="Clear selection"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 p-0.5 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSelectedIds(new Set()) }}
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

      {/* ── Messages List ── */}
      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={Envelope}
          title="No messages"
          description={search || activeTab !== 'all' ? 'Try adjusting your filters.' : 'Messages from your contact form will appear here.'}
        />
      ) : (
        <div className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5 backdrop-blur-sm">
          <div className="rounded-[calc(2rem-0.375rem)] bg-surface shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden">
            {/* Select All row */}
            <div className="flex items-center gap-3 px-4 md:px-5 py-2.5 border-b border-white/[0.05] bg-white/[0.01]">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-xs text-text-muted hover:text-white transition-colors"
              >
                {allVisibleSelected ? (
                  <CheckSquare weight="fill" className="h-4 w-4 text-gold" />
                ) : (
                  <Square weight="regular" className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {allVisibleSelected ? 'Deselect all' : `Select all (${filtered.length})`}
                </span>
              </button>
            </div>

            <div className="divide-y divide-white/[0.03]">
              {filtered.map((contact) => (
                <div
                  key={contact.id}
                  className={cn(
                    'flex items-center gap-3 md:gap-4 px-4 md:px-5 py-4 md:py-5 group transition-colors',
                    contact.status === 'new' && !selectedIds.has(contact.id) && 'bg-gold/[0.02]',
                    selectedIds.has(contact.id) && 'bg-gold/[0.05]',
                  )}
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => toggleSelect(contact.id, e)}
                    className="shrink-0 text-text-muted hover:text-gold transition-colors"
                  >
                    {selectedIds.has(contact.id) ? (
                      <CheckSquare weight="fill" className="h-4 w-4 text-gold" />
                    ) : (
                      <Square weight="regular" className="h-4 w-4 opacity-40 group-hover:opacity-100" />
                    )}
                  </button>

                  {/* Main clickable area */}
                  <button
                    onClick={() => {
                      setSelectedContact(contact)
                      if (contact.status === 'new') handleStatusChange(contact.id, 'read')
                    }}
                    className="flex-1 flex items-center gap-3 md:gap-4 text-left min-w-0"
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

                  {/* Quick-delete button (visible on hover) */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(contact) }}
                    className="shrink-0 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 flex items-center justify-center transition-all"
                    title="Delete message"
                  >
                    <Trash weight="bold" className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Message Detail Modal ── */}
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

      {/* ── Single Delete Confirmation ── */}
      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        description={`Are you sure you want to delete the message from "${deleteTarget?.name}"? This cannot be undone.`}
        isLoading={isDeleting}
      />

      {/* ── Bulk Delete Confirmation ── */}
      <AdminConfirmDialog
        isOpen={showBulkConfirm}
        onClose={() => setShowBulkConfirm(false)}
        onConfirm={handleBulkDelete}
        title={`Delete ${selectedIds.size} Message${selectedIds.size === 1 ? '' : 's'}`}
        description={`Are you sure you want to permanently delete ${selectedIds.size} selected message${selectedIds.size === 1 ? '' : 's'}? This cannot be undone.`}
        isLoading={isBulkDeleting}
      />
    </>
  )
}
