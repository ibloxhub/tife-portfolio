// PUT /api/contact/[id] — Update contact status (admin)
// DELETE /api/contact/[id] — Delete contact (admin)

import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, requireAuth } from '@/lib/api/helpers'
import { updateContactStatus, deleteContact } from '@/lib/services/contacts.service'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await requireAuth()
  if (!auth.authenticated) return errorResponse('Unauthorized', 401)

  try {
    const { id } = await params
    const body = await request.json()

    if (!body.status || !['new', 'read', 'replied', 'archived'].includes(body.status)) {
      return errorResponse('Invalid status. Must be: new, read, replied, or archived', 400)
    }

    const result = await updateContactStatus(id, body.status)
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
  const result = await deleteContact(id)
  if (result.error) return errorResponse(result.error, 400)
  return jsonResponse({ deleted: true })
}
