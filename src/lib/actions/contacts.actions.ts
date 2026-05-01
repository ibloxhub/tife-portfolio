'use server'

import { createContact } from '@/lib/services/contacts.service'
import { ContactInsert } from '@/lib/services/types'
import { revalidatePath } from 'next/cache'

import { sendAdminNotification, sendAutoReply } from '@/lib/services/email.service'

export async function submitContactAction(formData: ContactInsert) {
  try {
    const result = await createContact(formData)
    
    if (result.error) {
      return { success: false, error: result.error }
    }

    // Fire-and-forget email notifications
    if (result.data) {
      sendAdminNotification(result.data).catch(console.error)
      sendAutoReply(result.data).catch(console.error)
    }

    // Revalidate admin dashboard so new message appears
    revalidatePath('/admin/messages')
    
    return { success: true, data: result.data }
  } catch (err) {
    return { success: false, error: 'Failed to submit inquiry. Please try again.' }
  }
}
