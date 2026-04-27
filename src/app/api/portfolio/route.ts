// GET /api/portfolio — List portfolio items (public)
// POST /api/portfolio — Create a portfolio item (admin)

import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, requireAuth, parseSearchParams } from '@/lib/api/helpers'
import { getAllPortfolios, createPortfolio } from '@/lib/services/portfolio.service'
import type { PortfolioFilters, PaginationParams } from '@/lib/services/types'

export async function GET(request: NextRequest) {
  const params = parseSearchParams(request.url)

  const filters: PortfolioFilters = {
    ...(params.category && { category: params.category as PortfolioFilters['category'] }),
    ...(params.featured === 'true' && { isFeatured: true }),
    ...(params.search && { search: params.search }),
  }

  const pagination: PaginationParams = {
    page: params.page,
    limit: params.limit,
    ...(params.sortBy && { sortBy: params.sortBy }),
    ...(params.sortOrder && { sortOrder: params.sortOrder }),
  }

  const result = await getAllPortfolios(filters, pagination)
  if (result.error) return errorResponse(result.error, 500)
  return jsonResponse(result.data, 200, result.count)
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth()
  if (!auth.authenticated) return errorResponse('Unauthorized', 401)

  try {
    const body = await request.json()
    const result = await createPortfolio(body)
    if (result.error) return errorResponse(result.error, 400)
    return jsonResponse(result.data, 201)
  } catch {
    return errorResponse('Invalid request body', 400)
  }
}
