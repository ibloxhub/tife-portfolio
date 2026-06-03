'use client'

import { useState, useRef, useCallback, useId } from 'react'
import {
  Image as ImageIcon,
  Video,
  Play,
  Trash,
  Star,
  UploadSimple,
  Link as LinkIcon,
  ArrowsOutCardinal,
  Spinner,
  WarningCircle,
  X,
} from '@phosphor-icons/react'
import { extractVideoEmbedUrl, getVideoThumbnailUrl } from '@/lib/services/upload.service'
import { cn } from '@/lib/utils'

// ── Types ──────────────────────────────────────────────────────────────────────

type MediaType = 'image' | 'video'

interface MediaItem {
  id: string
  url: string
  type: MediaType
  preview?: string    // blob URL or YouTube thumbnail
  isUploading?: boolean
  uploadProgress?: number
  error?: string
}

interface AdminMediaUploadProps {
  mediaUrls: string[]
  mediaTypes: string[]
  onChange: (urls: string[], types: string[]) => void
  storagePath?: string
  label?: string
  helper?: string
}

// ── Accepted file types ────────────────────────────────────────────────────────

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/mov', 'video/webm', 'video/quicktime']
const ACCEPTED_ALL = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].join(',')

// ── Helper ─────────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2)
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AdminMediaUpload({
  mediaUrls,
  mediaTypes,
  onChange,
  storagePath = 'portfolio',
  label = 'Media Gallery',
  helper = 'Add images and videos for this project. First item becomes the cover.',
}: AdminMediaUploadProps) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Initialise items from existing data
  const [items, setItems] = useState<MediaItem[]>(() =>
    mediaUrls.map((url, i) => ({
      id: uid(),
      url,
      type: (mediaTypes[i] as MediaType) ?? 'image',
      preview: mediaTypes[i] === 'video' ? (getVideoThumbnailUrl(url) ?? undefined) : url,
    }))
  )

  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [videoUrlInput, setVideoUrlInput] = useState('')
  const [videoUrlError, setVideoUrlError] = useState('')

  // Drag-to-reorder state
  const [dragSrcIndex, setDragSrcIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // ── Sync items → parent ────────────────────────────────────────────────────
  function emitChange(newItems: MediaItem[]) {
    const finalItems = newItems.filter((i) => !i.isUploading && i.url && !i.error)
    onChange(finalItems.map((i) => i.url), finalItems.map((i) => i.type))
  }

  // ── File upload ────────────────────────────────────────────────────────────
  async function uploadSingleFile(file: File): Promise<MediaItem> {
    const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type)
    const type: MediaType = isImage ? 'image' : 'video'
    const ext = file.name.split('.').pop() ?? 'bin'
    const path = `${storagePath}/${type}s/${uid()}.${ext}`

    const placeholder: MediaItem = {
      id: uid(),
      url: '',
      type,
      preview: isImage ? URL.createObjectURL(file) : undefined,
      isUploading: true,
      uploadProgress: 0,
    }

    return new Promise(async (resolve) => {
      setItems((prev) => {
        const next = [...prev, placeholder]
        return next
      })

      let result: { data: string | null; error: string | null } = { data: null, error: null }
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('path', path)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        const json = await res.json()
        if (res.ok && json.success) {
          result = { data: json.data.url, error: null }
        } else {
          result = { data: null, error: json.message || 'Upload failed' }
        }
      } catch (err) {
        result = { data: null, error: (err as Error).message || 'Upload failed' }
      }

      setItems((prev) => {
        const next = prev.map((item) =>
          item.id === placeholder.id
            ? result.error
              ? { ...item, isUploading: false, error: result.error }
              : { ...item, isUploading: false, url: result.data!, uploadProgress: 100 }
            : item
        )
        emitChange(next)
        return next
      })

      resolve({
        ...placeholder,
        url: result.data ?? '',
        isUploading: false,
        error: result.error ?? undefined,
      })
    })
  }

  async function handleFiles(files: File[]) {
    const valid = files.filter(
      (f) => ACCEPTED_IMAGE_TYPES.includes(f.type) || ACCEPTED_VIDEO_TYPES.includes(f.type)
    )
    await Promise.all(valid.map(uploadSingleFile))
  }

  // ── File input change ──────────────────────────────────────────────────────
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) handleFiles(Array.from(e.target.files))
    e.target.value = ''
  }

  // ── Drop zone ──────────────────────────────────────────────────────────────
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDraggingOver(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDraggingOver(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDraggingOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length) handleFiles(files)
  }

  // ── Video URL ──────────────────────────────────────────────────────────────
  function handleAddVideoUrl() {
    setVideoUrlError('')
    const result = extractVideoEmbedUrl(videoUrlInput)
    if (!result) {
      setVideoUrlError('Please enter a valid YouTube or Vimeo URL')
      return
    }
    const thumbnail = getVideoThumbnailUrl(result.embedUrl)
    const newItem: MediaItem = {
      id: uid(),
      url: result.embedUrl,
      type: 'video',
      preview: thumbnail ?? undefined,
    }
    setItems((prev) => {
      const next = [...prev, newItem]
      emitChange(next)
      return next
    })
    setVideoUrlInput('')
  }

  // ── Remove item ────────────────────────────────────────────────────────────
  function handleRemove(id: string) {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id)
      emitChange(next)
      return next
    })
  }

  // ── Drag-to-reorder ────────────────────────────────────────────────────────
  function handleCardDragStart(index: number) {
    setDragSrcIndex(index)
  }

  function handleCardDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    setDragOverIndex(index)
  }

  function handleCardDrop(e: React.DragEvent, targetIndex: number) {
    e.preventDefault()
    if (dragSrcIndex === null || dragSrcIndex === targetIndex) {
      setDragSrcIndex(null)
      setDragOverIndex(null)
      return
    }
    setItems((prev) => {
      const next = [...prev]
      const [moved] = next.splice(dragSrcIndex, 1)
      next.splice(targetIndex, 0, moved)
      emitChange(next)
      return next
    })
    setDragSrcIndex(null)
    setDragOverIndex(null)
  }

  function handleCardDragEnd() {
    setDragSrcIndex(null)
    setDragOverIndex(null)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3">
      {/* Label */}
      <div>
        <span className="text-sm font-medium text-text-secondary">{label}</span>
        {helper && <p className="text-xs text-text-muted mt-0.5">{helper}</p>}
      </div>

      {/* Existing + uploading cards */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleCardDragStart(index)}
              onDragOver={(e) => handleCardDragOver(e, index)}
              onDrop={(e) => handleCardDrop(e, index)}
              onDragEnd={handleCardDragEnd}
              className={cn(
                'relative w-28 h-20 rounded-2xl overflow-hidden border bg-black/40 shrink-0 cursor-grab active:cursor-grabbing transition-all duration-200',
                dragOverIndex === index && dragSrcIndex !== index
                  ? 'border-gold scale-105 shadow-[0_0_12px_rgba(200,169,126,0.4)]'
                  : 'border-white/10',
                dragSrcIndex === index && 'opacity-40',
                item.error && 'border-red-500/40'
              )}
            >
              {/* Preview */}
              {item.preview ? (
                <img
                  src={item.preview}
                  alt="media preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {item.type === 'video'
                    ? <Video className="h-6 w-6 text-white/20" />
                    : <ImageIcon className="h-6 w-6 text-white/20" />
                  }
                </div>
              )}

              {/* Overlay when uploading */}
              {item.isUploading && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-1">
                  <Spinner className="h-5 w-5 text-gold animate-spin" />
                  <span className="text-[9px] text-white/60">Uploading...</span>
                </div>
              )}

              {/* Error state */}
              {item.error && (
                <div className="absolute inset-0 bg-red-900/70 flex flex-col items-center justify-center gap-1 p-1">
                  <WarningCircle className="h-5 w-5 text-red-400" />
                  <span className="text-[9px] text-red-300 text-center leading-tight">{item.error}</span>
                </div>
              )}

              {/* Badges */}
              {!item.isUploading && !item.error && (
                <>
                  {/* Type badge */}
                  <div className={cn(
                    'absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase',
                    item.type === 'video'
                      ? 'bg-blue-500/80 text-white'
                      : 'bg-black/60 text-white/80'
                  )}>
                    {item.type === 'video' ? <Play className="h-2.5 w-2.5" weight="fill" /> : <ImageIcon className="h-2.5 w-2.5" />}
                    {item.type}
                  </div>

                  {/* Cover badge on first item */}
                  {index === 0 && (
                    <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gold/80 text-[9px] font-bold text-black">
                      <Star className="h-2.5 w-2.5" weight="fill" />
                      Cover
                    </div>
                  )}

                  {/* Drag handle */}
                  <div className="absolute top-1.5 right-7 text-white/30">
                    <ArrowsOutCardinal className="h-3 w-3" />
                  </div>
                </>
              )}

              {/* Remove button */}
              {!item.isUploading && (
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 text-white/70 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="h-3 w-3" weight="bold" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200',
          isDraggingOver
            ? 'border-gold bg-gold/5 scale-[1.01]'
            : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.03]'
        )}
      >
        <div className={cn(
          'h-10 w-10 rounded-2xl flex items-center justify-center transition-colors',
          isDraggingOver ? 'bg-gold/20' : 'bg-white/5'
        )}>
          <UploadSimple
            className={cn('h-5 w-5 transition-colors', isDraggingOver ? 'text-gold' : 'text-white/30')}
            weight="bold"
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-white/60">
            {isDraggingOver ? 'Drop files here' : 'Drop images or videos here'}
          </p>
          <p className="text-xs text-white/30 mt-0.5">or click to browse • JPG, PNG, WebP, MP4, MOV</p>
        </div>
        <input
          id={inputId}
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_ALL}
          onChange={handleInputChange}
          className="sr-only"
        />
      </div>

      {/* Video URL input */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
            <input
              type="url"
              placeholder="Paste YouTube or Vimeo link..."
              value={videoUrlInput}
              onChange={(e) => { setVideoUrlInput(e.target.value); setVideoUrlError('') }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVideoUrl())}
              className="w-full h-10 rounded-xl bg-white/5 border border-white/10 pl-9 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={handleAddVideoUrl}
            disabled={!videoUrlInput.trim()}
            className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-medium hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Play className="h-3.5 w-3.5" weight="bold" />
            Add
          </button>
        </div>
        {videoUrlError && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <WarningCircle className="h-3.5 w-3.5" />
            {videoUrlError}
          </p>
        )}
      </div>
    </div>
  )
}
