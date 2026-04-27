// POST /api/upload — Upload file to Supabase Storage (admin)

import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, requireAuth } from '@/lib/api/helpers'
import { uploadFile } from '@/lib/services/upload.service'

export async function POST(request: NextRequest) {
  const auth = await requireAuth()
  if (!auth.authenticated) return errorResponse('Unauthorized', 401)

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const path = formData.get('path') as string | null

    if (!file) return errorResponse('No file provided', 400)
    if (!path) return errorResponse('No storage path provided', 400)

    const result = await uploadFile(file, path)
    if (result.error) return errorResponse(result.error, 400)
    return jsonResponse({ url: result.data }, 201)
  } catch {
    return errorResponse('Upload failed. Check file format and size.', 500)
  }
}
