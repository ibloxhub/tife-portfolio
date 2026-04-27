// GET /api/portfolio/slug/[slug] — Get portfolio by slug (public)

import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse } from '@/lib/api/helpers'
import { getPortfolioBySlug } from '@/lib/services/portfolio.service'

type Params = { params: Promise<{ slug: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params
  const result = await getPortfolioBySlug(slug)
  if (result.error) return errorResponse(result.error, 404)
  return jsonResponse(result.data)
}
