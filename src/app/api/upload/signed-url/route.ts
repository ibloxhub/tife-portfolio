// POST /api/upload/signed-url
// Creates a Supabase signed upload URL so the browser can PUT files
// directly to Supabase Storage without routing through Next.js.
// This completely bypasses Next.js body-size limits for large video files.

import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, requireAuth } from '@/lib/api/helpers'
import { createAdminClient } from '@/lib/supabase/admin'

const STORAGE_BUCKET = 'media'

export async function POST(request: NextRequest) {
  const auth = await requireAuth()
  if (!auth.authenticated) return errorResponse('Unauthorized', 401)

  try {
    const body = await request.json() as { path?: string }
    const path = body?.path?.trim()

    if (!path) return errorResponse('path is required', 400)

    const supabase = createAdminClient()
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUploadUrl(path)

    if (error) return errorResponse(error.message, 400)

    return jsonResponse({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
    }, 200)
  } catch (err) {
    return errorResponse((err as Error).message ?? 'Failed to create upload URL', 500)
  }
}
