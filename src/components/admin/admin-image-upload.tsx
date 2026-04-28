'use client'

import { useState, useRef, useCallback } from 'react'
import { UploadSimple, X, Image as ImageIcon, Spinner } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface AdminImageUploadProps {
  label: string
  value?: string | null
  onUpload: (url: string) => void
  onRemove?: () => void
  storagePath: string
  accept?: string
  maxSizeMB?: number
  helper?: string
}

export function AdminImageUpload({
  label,
  value,
  onUpload,
  onRemove,
  storagePath,
  accept = 'image/jpeg,image/png,image/webp,image/avif',
  maxSizeMB = 10,
  helper,
}: AdminImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null)

      // Client-side validation
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large. Maximum ${maxSizeMB}MB.`)
        return
      }

      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)

        // Generate unique path
        const ext = file.name.split('.').pop()
        const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        formData.append('path', `${storagePath}/${uniqueName}`)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const json = await res.json()

        if (!res.ok || !json.success) {
          setError(json.message || 'Upload failed')
          return
        }

        onUpload(json.data.url)
      } catch {
        setError('Upload failed. Please try again.')
      } finally {
        setIsUploading(false)
      }
    },
    [maxSizeMB, storagePath, onUpload]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-text-secondary text-xs uppercase tracking-widest font-medium">{label}</label>

      {value ? (
        /* Preview */
        <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/50">
          <img src={value} alt={label} className="w-full h-40 object-cover" />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/50"
            >
              <X weight="bold" className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ) : (
        /* Upload Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center gap-3 py-8 px-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors',
            isDragging
              ? 'border-gold bg-gold/5'
              : 'border-white/10 bg-black/30 hover:border-white/20 hover:bg-black/40',
            isUploading && 'pointer-events-none opacity-60'
          )}
        >
          {isUploading ? (
            <>
              <Spinner weight="light" className="h-8 w-8 text-gold animate-spin" />
              <span className="text-sm text-text-muted">Uploading...</span>
            </>
          ) : (
            <>
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                {isDragging ? (
                  <UploadSimple weight="light" className="h-5 w-5 text-gold" />
                ) : (
                  <ImageIcon weight="light" className="h-5 w-5 text-text-muted" />
                )}
              </div>
              <div className="text-center">
                <span className="text-sm text-white">Drop file here or click to browse</span>
                <p className="text-xs text-text-muted mt-1">
                  JPG, PNG, WebP • Max {maxSizeMB}MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input ref={inputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />

      {error && <p className="text-xs text-red-400">{error}</p>}
      {helper && !error && <p className="text-xs text-text-muted">{helper}</p>}
    </div>
  )
}
