'use client'

import { useState } from 'react'
import { Spinner } from '@phosphor-icons/react'
import { AdminInput, AdminTextarea, AdminToggle } from '@/components/admin/admin-form-field'
import { useToast } from '@/components/admin/admin-toast'
import { createServiceAction, updateServiceAction } from '@/app/(admin)/admin/actions/services.actions'
import type { Service } from '@/lib/services/types'

interface ServiceFormProps {
  service?: Service | null
  onSuccess: (item: Service, isNew: boolean) => void
  onCancel: () => void
}

export function ServiceForm({ service, onSuccess, onCancel }: ServiceFormProps) {
  const { showToast } = useToast()
  const isEditing = !!service

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState(service?.name ?? '')
  const [category, setCategory] = useState(service?.category ?? '')
  const [description, setDescription] = useState(service?.description ?? '')
  const [shortDescription, setShortDescription] = useState(service?.short_description ?? '')
  const [ctaText, setCtaText] = useState(service?.cta_text ?? 'Learn More')
  const [iconName, setIconName] = useState(service?.icon_name ?? '')
  const [isActive, setIsActive] = useState(service?.is_active ?? true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Service name is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    const data = {
      name: name.trim(),
      category: category.trim() || null,
      description: description.trim() || null,
      short_description: shortDescription.trim() || null,
      cta_text: ctaText.trim() || 'Learn More',
      icon_name: iconName.trim() || null,
      is_active: isActive,
    }

    try {
      let result
      if (isEditing && service) {
        result = await updateServiceAction(service.id, data)
      } else {
        result = await createServiceAction(data)
      }

      if (result.error) {
        showToast(typeof result.error === 'string' ? result.error : 'Something went wrong', 'error')
      } else if (result.data) {
        onSuccess(result.data as Service, !isEditing)
      }
    } catch {
      showToast('An unexpected error occurred', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <AdminInput
        label="Service Name"
        placeholder="e.g., Wedding Cinematography"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        required
      />

      <AdminInput
        label="Category"
        placeholder="e.g., Photography, Video, Events"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        helper="Optional. Group similar services together."
      />

      <AdminInput
        label="Short Description"
        placeholder="A brief one-liner for service cards"
        value={shortDescription}
        onChange={(e) => setShortDescription(e.target.value)}
        helper="Shown on service cards on the public website."
      />

      <AdminTextarea
        label="Full Description"
        placeholder="Describe this service in detail..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        helper="Optional. Shown on the service detail page."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminInput
          label="CTA Button Text"
          placeholder="Learn More"
          value={ctaText}
          onChange={(e) => setCtaText(e.target.value)}
          helper="Text shown on the call-to-action button."
        />
        <AdminInput
          label="Icon Name"
          placeholder="e.g., Camera, VideoCamera"
          value={iconName}
          onChange={(e) => setIconName(e.target.value)}
          helper="Optional. Phosphor icon name for the service card."
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-black/30 p-4">
        <AdminToggle
          label="Active"
          description="Show this service on the public website"
          checked={isActive}
          onChange={setIsActive}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-11 px-6 rounded-xl bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 px-6 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting && <Spinner className="h-4 w-4 animate-spin" />}
          {isEditing ? 'Save Changes' : 'Create Service'}
        </button>
      </div>
    </form>
  )
}
