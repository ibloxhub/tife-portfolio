'use client'

import { useState } from 'react'
import { Plus, MagnifyingGlass, Eye, PencilSimple, Trash, Star } from '@phosphor-icons/react'
import { AdminBadge, PublishBadge } from '@/components/admin/admin-badge'
import { AdminSelect } from '@/components/admin/admin-form-field'
import { AdminEmptyState } from '@/components/admin/admin-empty-state'
import { AdminConfirmDialog } from '@/components/admin/admin-confirm-dialog'
import { AdminModal } from '@/components/admin/admin-modal'
import { PortfolioForm } from '@/components/admin/portfolio-form'
import { useToast } from '@/components/admin/admin-toast'
import { deletePortfolioAction, updatePortfolioAction } from '@/app/(admin)/admin/actions/portfolio.actions'
import { cn } from '@/lib/utils'
import type { Portfolio } from '@/lib/services/types'

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'photo', label: 'Photo' },
  { value: 'video', label: 'Video' },
  { value: 'event', label: 'Event' },
  { value: 'marketing', label: 'Marketing' },
]

interface PortfolioGridProps {
  initialPortfolios: Portfolio[]
}

export function PortfolioGrid({ initialPortfolios }: PortfolioGridProps) {
  const { showToast } = useToast()
  const [portfolios, setPortfolios] = useState(initialPortfolios)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [publishFilter, setPublishFilter] = useState<'all' | 'published' | 'draft'>('all')

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Portfolio | null>(null)

  // Delete states
  const [deleteTarget, setDeleteTarget] = useState<Portfolio | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter logic
  const filtered = portfolios.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilter && p.category !== categoryFilter) return false
    if (publishFilter === 'published' && !p.is_published) return false
    if (publishFilter === 'draft' && p.is_published) return false
    return true
  })

  // Toggle publish
  async function handleTogglePublish(item: Portfolio) {
    const newState = !item.is_published
    // Optimistic update
    setPortfolios((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, is_published: newState } : p))
    )
    const result = await updatePortfolioAction(item.id, { is_published: newState })
    if (result.error) {
      // Revert
      setPortfolios((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, is_published: !newState } : p))
      )
      showToast(result.error, 'error')
    } else {
      showToast(newState ? 'Project published' : 'Project unpublished')
    }
  }

  // Toggle featured
  async function handleToggleFeatured(item: Portfolio) {
    const newState = !item.is_featured
    setPortfolios((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, is_featured: newState } : p))
    )
    const result = await updatePortfolioAction(item.id, { is_featured: newState })
    if (result.error) {
      setPortfolios((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, is_featured: !newState } : p))
      )
      showToast(result.error, 'error')
    } else {
      showToast(newState ? 'Added to featured' : 'Removed from featured')
    }
  }

  // Delete
  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    const result = await deletePortfolioAction(deleteTarget.id)
    if (result.error) {
      showToast(typeof result.error === 'string' ? result.error : 'Failed to delete', 'error')
    } else {
      setPortfolios((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      showToast('Project deleted')
    }
    setIsDeleting(false)
    setDeleteTarget(null)
  }

  // After form submit
  function handleFormSuccess(item: Portfolio, isNew: boolean) {
    if (isNew) {
      setPortfolios((prev) => [...prev, item])
    } else {
      setPortfolios((prev) => prev.map((p) => (p.id === item.id ? item : p)))
    }
    setIsFormOpen(false)
    setEditingItem(null)
    showToast(isNew ? 'Project created!' : 'Project updated!')
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72 group">
            <MagnifyingGlass weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-gold transition-colors" />
            <input
              type="text"
              placeholder="Search master library..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-2xl bg-white/[0.03] border border-white/10 pl-11 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all duration-300"
            />
          </div>

          {/* Category Filter */}
          <AdminSelect
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categories}
            className="w-full sm:w-48"
          />

          {/* Publish Filter */}
          <div className="flex items-center rounded-2xl bg-white/[0.03] border border-white/10 p-1">
            {(['all', 'published', 'draft'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setPublishFilter(f)}
                className={cn(
                  'h-9 px-4 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all duration-300',
                  publishFilter === f
                    ? 'bg-white/10 text-white shadow-lg'
                    : 'text-white/30 hover:text-white'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={() => {
            setEditingItem(null)
            setIsFormOpen(true)
          }}
          className="h-11 px-6 rounded-2xl bg-white text-black text-sm font-bold hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all flex items-center gap-2 shrink-0 uppercase tracking-wider"
        >
          <Plus weight="bold" className="h-4 w-4" />
          New Project
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <AdminEmptyState
          title="No projects found"
          description={search || categoryFilter ? 'Try adjusting your filters.' : 'Add your first project to get started.'}
          action={
            !search && !categoryFilter ? (
              <button
                onClick={() => {
                  setEditingItem(null)
                  setIsFormOpen(true)
                }}
                className="h-10 px-5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all flex items-center gap-2"
              >
                <Plus weight="bold" className="h-4 w-4" />
                Add Project
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-[2.5rem] bg-white/[0.03] p-[1px] border border-white/[0.08] backdrop-blur-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-gold/30 transition-all duration-500"
            >
              <div className="rounded-[calc(2.5rem-1px)] bg-black/40 overflow-hidden">
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] bg-[#111] overflow-hidden">
                  {item.thumbnail_url ? (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold/10 to-transparent">
                      <span className="text-4xl font-bold text-white/5 tracking-tighter">
                        {item.title.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Full-Screen Glass Overlay (Desktop Hover Only) */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm hidden lg:flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                     <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingItem(item)
                          setIsFormOpen(true)
                        }}
                        className="h-12 w-12 rounded-2xl bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
                      >
                        <PencilSimple weight="bold" className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFeatured(item)
                        }}
                        className={cn(
                          "h-12 w-12 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl backdrop-blur-md border",
                          item.is_featured ? "bg-gold text-black border-gold" : "bg-black/40 text-white border-white/20"
                        )}
                      >
                        <Star weight={item.is_featured ? 'fill' : 'bold'} className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(item)
                        }}
                        className="h-12 w-12 rounded-2xl bg-red-500 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
                      >
                        <Trash weight="bold" className="h-5 w-5" />
                      </button>
                  </div>

                  {/* Mobile Floating Action Hub (Compact, Non-Blocking) */}
                  <div className="lg:hidden absolute bottom-3 right-3 flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingItem(item)
                        setIsFormOpen(true)
                      }}
                      className="h-9 w-9 rounded-xl bg-white/10 text-white flex items-center justify-center active:bg-white active:text-black transition-all"
                    >
                      <PencilSimple weight="bold" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFeatured(item)
                      }}
                      className={cn(
                        "h-9 w-9 rounded-xl flex items-center justify-center active:scale-90 transition-all",
                        item.is_featured ? "bg-gold/20 text-gold" : "bg-white/10 text-white/40"
                      )}
                    >
                      <Star weight={item.is_featured ? 'fill' : 'bold'} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(item)
                      }}
                      className="h-9 w-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center active:bg-red-500 active:text-white transition-all"
                    >
                      <Trash weight="bold" className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Publish Status Badge (Floating) */}
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <PublishBadge isPublished={item.is_published} />
                  </div>

                  {/* View Count (Floating Glass) */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 pointer-events-none">
                    <Eye weight="bold" className="h-3 w-3 text-gold" />
                    <span className="text-[10px] font-bold text-white/80">{item.view_count}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base font-bold text-white tracking-tight group-hover:text-gold transition-colors duration-500">{item.title}</h3>
                    <div className="flex items-center gap-2">
                      <AdminBadge variant="category" category={item.category}>
                        {item.category}
                      </AdminBadge>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-xs text-white/40 line-clamp-2 leading-relaxed font-light">{item.description}</p>
                  )}

                  {/* Quick Toggle Publish */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleTogglePublish(item)}
                      className={cn(
                        'w-full h-10 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all duration-500',
                        item.is_published
                          ? 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                          : 'bg-gold/10 text-gold-light border border-gold/20 hover:bg-gold/20'
                      )}
                    >
                      {item.is_published ? 'Unpublish' : 'Publish Project'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingItem(null)
        }}
        title={editingItem ? 'Edit Project' : 'New Project'}
        subtitle={editingItem ? `Editing "${editingItem.title}"` : 'Add a new portfolio project'}
        maxWidth="xl"
      >
        <PortfolioForm
          portfolio={editingItem}
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
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  )
}
