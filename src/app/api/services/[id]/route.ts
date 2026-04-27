// GET /api/services/[id] — Get service by ID (admin)
// PUT /api/services/[id] — Update service (admin)
// DELETE /api/services/[id] — Delete service (admin)

import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, requireAuth } from '@/lib/api/helpers'
import { getServiceById, updateService, deleteService } from '@/lib/services/services.service'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const auth = await requireAuth()
  if (!auth.authenticated) return errorResponse('Unauthorized', 401)

  const { id } = await params
  const result = await getServiceById(id)
  if (result.error) return errorResponse(result.error, 404)
  return jsonResponse(result.data)
}

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await requireAuth()
  if (!auth.authenticated) return errorResponse('Unauthorized', 401)

  try {
    const { id } = await params
    const body = await request.json()
    const result = await updateService(id, body)
    if (result.error) return errorResponse(result.error, 400)
    return jsonResponse(result.data)
  } catch {
    return errorResponse('Invalid request body', 400)
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const auth = await requireAuth()
  if (!auth.authenticated) return errorResponse('Unauthorized', 401)

  const { id } = await params
  const result = await deleteService(id)
  if (result.error) return errorResponse(result.error, 400)
  return jsonResponse({ deleted: true })
}
