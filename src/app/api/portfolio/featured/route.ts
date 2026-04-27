// GET /api/portfolio/featured — Get featured portfolio items (public)

import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse } from '@/lib/api/helpers'
import { getFeaturedPortfolios } from '@/lib/services/portfolio.service'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') ?? '6', 10)

  const result = await getFeaturedPortfolios(limit)
  if (result.error) return errorResponse(result.error, 500)
  return jsonResponse(result.data)
}
