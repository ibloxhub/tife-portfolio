'use client'

import { useState } from 'react'
import { Plus, PencilSimple, Trash, ArrowUp, ArrowDown, Briefcase } from '@phosphor-icons/react'
import { AdminTable, type TableColumn } from '@/components/admin/admin-table'
import { AdminBadge } from '@/components/admin/admin-badge'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'
import { AdminConfirmDialog } from '@/components/admin/admin-confirm-dialog'
import { AdminModal } from '@/components/admin/admin-modal'
import { ServiceForm } from '@/components/admin/service-form'
import { useToast } from '@/components/admin/admin-toast'
import { deleteServiceAction, updateServiceAction, reorderServicesAction } from '@/app/(admin)/admin/actions/services.actions'
import { cn } from '@/lib/utils'
import type { Service } from '@/lib/services/types'

interface ServicesTableProps {
  initialServices: Service[]
}

export function ServicesTable({ initialServices }: ServicesTableProps) {
  const { showToast } = useToast()
  const [services, setServices] = useState(initialServices)

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Service | null>(null)

  // Delete states
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Toggle active
  async function handleToggleActive(item: Service) {
    const newState = !item.is_active
    setServices((prev) =>
      prev.map((s) => (s.id === item.id ? { ...s, is_active: newState } : s))
    )
    const result = await updateServiceAction(item.id, { is_active: newState })
    if (result.error) {
      setServices((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, is_active: !newState } : s))
      )
      showToast(typeof result.error === 'string' ? result.error : 'Failed to update', 'error')
    } else {
      showToast(newState ? 'Service activated' : 'Service deactivated')
    }
  }

  // Move up/down
  async function handleMove(item: Service, direction: 'up' | 'down') {
    // 1. Get current visual order
    const sorted = [...services].sort((a, b) => a.sort_order - b.sort_order)
    const idx = sorted.findIndex((s) => s.id === item.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1

    if (swapIdx < 0 || swapIdx >= sorted.length) return

    // 2. Swap items in the array
    const newSorted = [...sorted]
    const temp = newSorted[idx]
    newSorted[idx] = newSorted[swapIdx]
    newSorted[swapIdx] = temp

    // 3. Re-assign sort_order based on the new array index
    const newServices = newSorted.map((s, index) => ({ ...s, sort_order: index }))
    
    // 4. Update local state immediately
    setServices(newServices)

    // 5. Send all updates to the server to ensure consistency
    const updates = newServices.map(s => ({ id: s.id, sort_order: s.sort_order }))
    const result = await reorderServicesAction(updates)
    
    if (result.error) {
      setServices(sorted) // Revert
      showToast(typeof result.error === 'string' ? result.error : 'Failed to reorder', 'error')
    }
  }

  // Delete
  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    const result = await deleteServiceAction(deleteTarget.id)
    if (result.error) {
      showToast(typeof result.error === 'string' ? result.error : 'Failed to delete', 'error')
    } else {
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      showToast('Service deleted')
    }
    setIsDeleting(false)
    setDeleteTarget(null)
  }

  // Form success
  function handleFormSuccess(item: Service, isNew: boolean) {
    if (isNew) {
      setServices((prev) => [...prev, item])
    } else {
      setServices((prev) => prev.map((s) => (s.id === item.id ? item : s)))
    }
    setIsFormOpen(false)
    setEditingItem(null)
    showToast(isNew ? 'Service created!' : 'Service updated!')
  }

  const sorted = [...services].sort((a, b) => a.sort_order - b.sort_order)

  const columns: TableColumn<Service>[] = [
    {
      key: 'name',
      header: 'Service',
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-white">{item.name}</span>
          {item.short_description && (
            <span className="text-xs text-text-muted line-clamp-1">{item.short_description}</span>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      className: 'hidden sm:table-cell',
      render: (item) => (
        <span className="text-sm text-text-secondary">{item.category || '—'}</span>
      ),
    },
    {
      key: 'clicks',
      header: 'Clicks',
      className: 'hidden md:table-cell',
      render: (item) => (
        <span className="text-sm text-text-secondary">{item.click_count}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <button onClick={() => handleToggleActive(item)}>
          <AdminBadge
            variant="status"
            status={item.is_active ? 'replied' : 'archived'}
          >
            {item.is_active ? 'Active' : 'Inactive'}
          </AdminBadge>
        </button>
      ),
    },
    {
      key: 'order',
      header: 'Order',
      render: (item) => {
        const idx = sorted.findIndex((s) => s.id === item.id)
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleMove(item, 'up')}
              disabled={idx === 0}
              className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowUp weight="light" className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleMove(item, 'down')}
              disabled={idx === sorted.length - 1}
              className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowDown weight="light" className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      },
    },
    {
      key: 'actions',
      header: '',
      width: 'w-24',
      render: (item) => (
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={() => {
              setEditingItem(item)
              setIsFormOpen(true)
            }}
            className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors"
          >
            <PencilSimple weight="light" className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(item)}
            className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash weight="light" className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-muted">{services.length} service{services.length !== 1 ? 's' : ''}</span>
        <button
          onClick={() => {
            setEditingItem(null)
            setIsFormOpen(true)
          }}
          className="h-10 px-5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 active:scale-[0.98] transition-all flex items-center gap-2"
        >
          <Plus weight="bold" className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {/* Table or Empty */}
      {sorted.length === 0 ? (
        <AdminEmptyState
          icon={Briefcase}
          title="No services yet"
          description="Add the services you offer so clients can discover and inquire about them."
          action={
            <button
              onClick={() => {
                setEditingItem(null)
                setIsFormOpen(true)
              }}
              className="h-10 px-5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all flex items-center gap-2"
            >
              <Plus weight="bold" className="h-4 w-4" />
              Add Service
            </button>
          }
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <AdminTable
              columns={columns}
              data={sorted}
              keyExtractor={(item) => item.id}
              emptyMessage="No services found"
            />
          </div>

          {/* Mobile Card List */}
          <div className="flex flex-col gap-4 md:hidden">
            {sorted.map((item, idx) => (
              <div key={item.id} className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5 backdrop-blur-sm">
                <div className="flex flex-col gap-4 rounded-[calc(2rem-0.375rem)] bg-surface p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  {/* Header: Name & Status */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-semibold text-white">{item.name}</span>
                      {item.category && <span className="text-xs text-text-muted uppercase tracking-widest">{item.category}</span>}
                    </div>
                    <button onClick={() => handleToggleActive(item)} className="shrink-0">
                      <AdminBadge variant="status" status={item.is_active ? 'replied' : 'archived'}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </AdminBadge>
                    </button>
                  </div>

                  {/* Body: Description & Clicks */}
                  <div className="flex flex-col gap-2">
                    {item.short_description && (
                      <p className="text-sm text-text-secondary line-clamp-2">{item.short_description}</p>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-text-muted mt-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                      {item.click_count} clicks
                    </div>
                  </div>

                  {/* Footer: Actions & Ordering */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(item, 'up')}
                        disabled={idx === 0}
                        className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ArrowUp weight="light" className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMove(item, 'down')}
                        disabled={idx === sorted.length - 1}
                        className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ArrowDown weight="light" className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item)
                          setIsFormOpen(true)
                        }}
                        className="h-9 px-4 rounded-xl bg-white/5 text-text-secondary text-sm font-medium hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                      >
                        <PencilSimple weight="light" className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash weight="light" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingItem(null)
        }}
        title={editingItem ? 'Edit Service' : 'New Service'}
        subtitle={editingItem ? `Editing "${editingItem.name}"` : 'Add a new service offering'}
      >
        <ServiceForm
          service={editingItem}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingItem(null)
          }}
        />
      </AdminModal>

      {/* Delete Confirmation */}
      <AdminConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone. If contacts are linked to this service, deletion will be blocked.`}
        isLoading={isDeleting}
      />
    </>
  )
}
