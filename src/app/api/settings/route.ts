// GET /api/settings — Get global site settings (public)
// PUT /api/settings — Update site settings (admin)

import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, requireAuth } from '@/lib/api/helpers'
import { getSettings, updateSettings } from '@/lib/services/settings.service'

export async function GET() {
  const result = await getSettings()
  if (result.error) return errorResponse(result.error, 500)
  return jsonResponse(result.data)
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth()
  if (!auth.authenticated) return errorResponse('Unauthorized', 401)

  try {
    const body = await request.json()
    const result = await updateSettings(body)
    if (result.error) return errorResponse(result.error, 400)
    return jsonResponse(result.data)
  } catch {
    return errorResponse('Invalid request body', 400)
  }
}
