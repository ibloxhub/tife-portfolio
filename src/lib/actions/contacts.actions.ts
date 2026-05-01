'use server'

import { createContact } from '@/lib/services/contacts.service'
import { ContactInsert } from '@/lib/services/types'
import { revalidatePath } from 'next/cache'

export async function submitContactAction(formData: ContactInsert) {
  try {
    const result = await createContact(formData)
    
    if (result.error) {
      return { success: false, error: result.error }
    }

    // Revalidate admin dashboard so new message appears
    revalidatePath('/admin/messages')
    
    return { success: true, data: result.data }
  } catch (err) {
    return { success: false, error: 'Failed to submit inquiry. Please try again.' }
  }
}
