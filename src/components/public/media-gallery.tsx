'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Play, X, CaretLeft, CaretRight } from '@phosphor-icons/react'
import { CustomVideoPlayer } from '@/components/public/custom-video-player'
import { cn } from '@/lib/utils'

interface MediaItem {
  url: string
  type: 'image' | 'video'
}

interface MediaGalleryProps {
  items: MediaItem[]
  projectTitle: string
}

function detectVideoType(url: string): 'file' | 'youtube' | 'vimeo' {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('vimeo.com')) return 'vimeo'
  return 'file'
}

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(/\/embed\/([^?]+)/)
  if (match?.[1]) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`
  return null
}

export function MediaGallery({ items, projectTitle }: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const showStrip = items.length >= 2
  const activeItem = items[activeIndex]

  // ── Keyboard navigation ──────────────────────────────────────────────────────
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % items.length)
    if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + items.length) % items.length)
    if (e.key === 'Escape') setLightboxOpen(false)
  }, [items.length])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  if (!items.length) return null

  // ── Thumbnail strip rendering ────────────────────────────────────────────────
  function Thumbnail({ item, index }: { item: MediaItem; index: number }) {
    const isActive = index === activeIndex
    const videoThumb = item.type === 'video' ? getYouTubeThumbnail(item.url) : null

    return (
      <button
        onClick={() => setActiveIndex(index)}
        className={cn(
          'relative shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200',
          isActive
            ? 'border-[#C8A97E] opacity-100 shadow-[0_0_10px_rgba(200,169,126,0.4)]'
            : 'border-transparent opacity-50 hover:opacity-80'
        )}
      >
        {videoThumb ? (
          <img src={videoThumb} alt="" className="w-full h-full object-cover" />
        ) : item.type === 'image' ? (
          <Image
            src={item.url}
            alt={`${projectTitle} — thumbnail ${index + 1}`}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full bg-black/60 flex items-center justify-center">
            <Play className="h-5 w-5 text-white/50" weight="fill" />
          </div>
        )}

        {/* Video play badge */}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full bg-[#C8A97E]/90 flex items-center justify-center shadow-lg">
              <Play weight="fill" className="h-3 w-3 text-black ml-0.5" />
            </div>
          </div>
        )}
      </button>
    )
  }

  // ── Main viewer ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3">
      {/* Main Viewer */}
      <div className="relative rounded-2xl overflow-hidden bg-black/40">
        {activeItem.type === 'image' ? (
          <button
            onClick={() => setLightboxOpen(true)}
            className="relative block w-full aspect-video cursor-zoom-in group"
          >
            <Image
              src={activeItem.url}
              alt={`${projectTitle} — image ${activeIndex + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              sizes="(max-width: 768px) 100vw, 70vw"
              priority={activeIndex === 0}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
          </button>
        ) : (
          <CustomVideoPlayer
            src={activeItem.url}
            type={detectVideoType(activeItem.url)}
            className="w-full aspect-video"
          />
        )}

        {/* Prev / Next arrows (when multiple items) */}
        {showStrip && (
          <>
            <button
              onClick={() => setActiveIndex((i) => (i - 1 + items.length) % items.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all"
            >
              <CaretLeft weight="bold" className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i + 1) % items.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all"
            >
              <CaretRight weight="bold" className="h-4 w-4" />
            </button>

            {/* Dot counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    'rounded-full transition-all duration-200',
                    i === activeIndex
                      ? 'w-4 h-1.5 bg-[#C8A97E]'
                      : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip — only when 2+ items */}
      {showStrip && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {items.map((item, index) => (
            <Thumbnail key={index} item={item} index={index} />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && activeItem.type === 'image' && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-5 right-5 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            onClick={() => setLightboxOpen(false)}
          >
            <X weight="bold" className="h-5 w-5" />
          </button>

          {/* Prev / Next in lightbox */}
          {items.filter((i) => i.type === 'image').length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((i) => (i - 1 + items.length) % items.length)
                }}
                className="absolute left-5 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              >
                <CaretLeft weight="bold" className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((i) => (i + 1) % items.length)
                }}
                className="absolute right-5 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              >
                <CaretRight weight="bold" className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Lightbox image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeItem.url}
              alt={`${projectTitle} — fullscreen view`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-sm">
            {activeIndex + 1} / {items.length}
          </div>
        </div>
      )}
    </div>
  )
}
