// GET /api/services — List all active services (public)
// POST /api/services — Create a new service (admin)

import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, requireAuth, parseSearchParams } from '@/lib/api/helpers'
import { getAllServices, createService } from '@/lib/services/services.service'
import type { PaginationParams } from '@/lib/services/types'

export async function GET(request: NextRequest) {
  const params = parseSearchParams(request.url)

  const pagination: PaginationParams = {
    page: params.page,
    limit: params.limit,
    ...(params.sortBy && { sortBy: params.sortBy }),
    ...(params.sortOrder && { sortOrder: params.sortOrder }),
  }

  const result = await getAllServices(pagination)
  if (result.error) return errorResponse(result.error, 500)
  return jsonResponse(result.data, 200, result.count)
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth()
  if (!auth.authenticated) return errorResponse('Unauthorized', 401)

  try {
    const body = await request.json()
    const result = await createService(body)
    if (result.error) return errorResponse(result.error, 400)
    return jsonResponse(result.data, 201)
  } catch {
    return errorResponse('Invalid request body', 400)
  }
}
