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
