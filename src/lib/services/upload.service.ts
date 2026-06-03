// ============================================================
// Upload Service — Supabase Storage File Management
// ============================================================

import { createAdminClient } from '@/lib/supabase/admin'
import type { ServiceResponse } from './types'

// --- File Validation Constants ---
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024   // 10 MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024  // 500 MB

const STORAGE_BUCKET = 'media'

/**
 * Upload a file to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadFile(
  file: File,
  path: string
): Promise<ServiceResponse<string>> {
  try {
    // Validate file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)

    if (!isImage && !isVideo) {
      return {
        data: null,
        error: `Invalid file type: ${file.type}. Allowed: ${[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(', ')}`,
      }
    }

    // Validate file size
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE
    if (file.size > maxSize) {
      const maxMB = maxSize / (1024 * 1024)
      return {
        data: null,
        error: `File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum: ${maxMB}MB for ${isImage ? 'images' : 'videos'}.`,
      }
    }

    const supabase = createAdminClient()

    // Upload the file
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true, // Overwrite if exists
      })

    if (error) return { data: null, error: error.message }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path)

    return { data: urlData.publicUrl, error: null }
  } catch (err) {
    return { data: null, error: `Upload failed: ${(err as Error).message}` }
  }
}

/**
 * Delete a file from Supabase Storage.
 */
export async function deleteFile(path: string): Promise<ServiceResponse<boolean>> {
  try {
    const supabase = createAdminClient()
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path])

    if (error) return { data: null, error: error.message }
    return { data: true, error: null }
  } catch (err) {
    return { data: null, error: `Delete failed: ${(err as Error).message}` }
  }
}

/**
 * Get the public URL for a file in Supabase Storage.
 */
export function getPublicUrl(path: string): string {
  const supabase = createAdminClient()
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path)

  return data.publicUrl
}

/**
 * Extract an embed URL from a YouTube or Vimeo link.
 * Returns null if the URL is not a recognised video platform link.
 */
export function extractVideoEmbedUrl(url: string): { embedUrl: string; platform: 'youtube' | 'vimeo' } | null {
  try {
    const parsed = new URL(url.trim())

    // YouTube — youtube.com/watch?v=ID or youtu.be/ID
    const ytMatch =
      parsed.hostname.includes('youtube.com') && parsed.searchParams.get('v')
        ? parsed.searchParams.get('v')
        : parsed.hostname === 'youtu.be'
        ? parsed.pathname.slice(1)
        : null

    if (ytMatch) {
      return {
        embedUrl: `https://www.youtube.com/embed/${ytMatch}?enablejsapi=1&rel=0&modestbranding=1`,
        platform: 'youtube',
      }
    }

    // Vimeo — vimeo.com/ID or vimeo.com/video/ID
    const vimeoMatch = parsed.hostname.includes('vimeo.com')
      ? parsed.pathname.match(/\/(?:video\/)?(\d+)/)?.[1]
      : null

    if (vimeoMatch) {
      return {
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch}?api=1&title=0&byline=0&portrait=0`,
        platform: 'vimeo',
      }
    }

    return null
  } catch {
    return null
  }
}

/**
 * Get a thumbnail URL for a video embed URL.
 * For YouTube, returns the standard mqdefault thumbnail.
 * For Vimeo/file uploads, returns null (caller should use a placeholder).
 */
export function getVideoThumbnailUrl(embedUrl: string): string | null {
  // YouTube embed URL contains youtube.com/embed/VIDEO_ID
  const ytIdMatch = embedUrl.match(/youtube\.com\/embed\/([^?]+)/)
  if (ytIdMatch?.[1]) {
    return `https://img.youtube.com/vi/${ytIdMatch[1]}/mqdefault.jpg`
  }
  return null
}

