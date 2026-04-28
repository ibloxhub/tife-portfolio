import { getAllContacts, getUnreadContactCount } from '@/lib/services/contacts.service'
import { MessagesList } from '@/components/admin/messages-list'

export default async function MessagesPage() {
  const [contactsResult, unreadResult] = await Promise.all([
    getAllContacts(undefined, { page: 1, limit: 200, sortBy: 'created_at', sortOrder: 'desc' }),
    getUnreadContactCount(),
  ])

  const contacts = contactsResult.data ?? []
  const unreadCount = unreadResult.data ?? 0

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tight">Messages</h1>
          {unreadCount > 0 && (
            <span className="bg-gold/10 text-gold-light rounded-full text-xs font-medium px-2.5 py-1 border border-gold/20">
              {unreadCount} new
            </span>
          )}
        </div>
        <p className="text-text-secondary text-sm">Manage inquiries from potential clients.</p>
      </div>

      <MessagesList initialContacts={contacts} />
    </div>
  )
}
