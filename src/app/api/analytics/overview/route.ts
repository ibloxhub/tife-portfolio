// GET /api/analytics/overview — Get aggregated analytics (admin)

import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, requireAuth, parseSearchParams } from '@/lib/api/helpers'
import { getAnalyticsOverview } from '@/lib/services/events.service'

export async function GET(request: NextRequest) {
  const auth = await requireAuth()
  if (!auth.authenticated) return errorResponse('Unauthorized', 401)

  const params = parseSearchParams(request.url)
  const result = await getAnalyticsOverview(params.startDate, params.endDate)

  if (result.error) return errorResponse(result.error, 500)
  return jsonResponse(result.data)
}
