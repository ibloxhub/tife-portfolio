'use client'

import { useState } from 'react'
import { Spinner } from '@phosphor-icons/react'
import { AdminInput, AdminTextarea, AdminSelect, AdminToggle } from '@/components/admin/admin-form-field'
import { AdminImageUpload } from '@/components/admin/admin-image-upload'
import { useToast } from '@/components/admin/admin-toast'
import { createPortfolioAction, updatePortfolioAction } from '@/app/(admin)/admin/actions/portfolio.actions'
import type { Portfolio } from '@/lib/services/types'

const categoryOptions = [
  { value: 'photo', label: 'Photography' },
  { value: 'video', label: 'Videography' },
  { value: 'event', label: 'Event' },
  { value: 'marketing', label: 'Marketing' },
]

interface PortfolioFormProps {
  portfolio?: Portfolio | null
  onSuccess: (item: Portfolio, isNew: boolean) => void
  onCancel: () => void
}

export function PortfolioForm({ portfolio, onSuccess, onCancel }: PortfolioFormProps) {
  const { showToast } = useToast()
  const isEditing = !!portfolio

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState(portfolio?.title ?? '')
  const [description, setDescription] = useState(portfolio?.description ?? '')
  const [category, setCategory] = useState(portfolio?.category ?? '')
  const [thumbnailUrl, setThumbnailUrl] = useState(portfolio?.thumbnail_url ?? '')
  const [isFeatured, setIsFeatured] = useState(portfolio?.is_featured ?? false)
  const [isPublished, setIsPublished] = useState(portfolio?.is_published ?? false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const errs: Record<string, string> = {}
    if (!title.trim()) errs.title = 'Title is required'
    if (!category) errs.category = 'Category is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    const data = {
      title: title.trim(),
      description: description.trim() || null,
      category: category as 'photo' | 'video' | 'event' | 'marketing',
      thumbnail_url: thumbnailUrl || null,
      is_featured: isFeatured,
      is_published: isPublished,
    }

    try {
      let result
      if (isEditing && portfolio) {
        result = await updatePortfolioAction(portfolio.id, data)
      } else {
        result = await createPortfolioAction(data)
      }

      if (result.error) {
        showToast(typeof result.error === 'string' ? result.error : 'Something went wrong', 'error')
      } else if (result.data) {
        onSuccess(result.data as Portfolio, !isEditing)
      }
    } catch {
      showToast('An unexpected error occurred', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <AdminInput
            label="Project Title"
            placeholder="e.g., Lagos Wedding Highlight"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            required
          />

          <AdminSelect
            label="Category"
            options={categoryOptions}
            placeholder="Select a category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            error={errors.category}
            required
          />

          <AdminTextarea
            label="Description"
            placeholder="Tell the story behind this project..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            helper="Optional. Shown on the project detail page."
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <AdminImageUpload
            label="Thumbnail"
            value={thumbnailUrl}
            onUpload={(url) => setThumbnailUrl(url)}
            onRemove={() => setThumbnailUrl('')}
            storagePath="portfolio/thumbnails"
            helper="Main image shown in the portfolio grid."
          />

          <div className="rounded-xl border border-white/10 bg-black/30 p-4 flex flex-col gap-4">
            <span className="text-text-secondary text-xs uppercase tracking-widest font-medium">Visibility</span>
            <AdminToggle
              label="Published"
              description="Show this project on the public website"
              checked={isPublished}
              onChange={setIsPublished}
            />
            <AdminToggle
              label="Featured"
              description="Display on the homepage featured section"
              checked={isFeatured}
              onChange={setIsFeatured}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-11 px-6 rounded-2xl bg-white/5 text-white text-[10px] font-bold tracking-widest uppercase hover:bg-white/10 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 px-8 rounded-2xl bg-white text-black text-[10px] font-bold tracking-widest uppercase hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting && <Spinner weight="bold" className="h-4 w-4 animate-spin" />}
          {isEditing ? 'Save Changes' : 'Create Project'}
        </button>
      </div>
    </form>
  )
}
