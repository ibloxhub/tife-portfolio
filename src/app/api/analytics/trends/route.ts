// GET /api/analytics/trends — Today vs yesterday event counts (admin)

import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, requireAuth } from '@/lib/api/helpers'
import { getAnalyticsTrends } from '@/lib/services/events.service'

export async function GET(_request: NextRequest) {
  const auth = await requireAuth()
  if (!auth.authenticated) return errorResponse('Unauthorized', 401)

  const result = await getAnalyticsTrends()
  if (result.error) return errorResponse(result.error, 500)
  return jsonResponse(result.data)
}
