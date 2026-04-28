import { getAllServices } from '@/lib/services/services.service'
import { ServicesTable } from '@/components/admin/services-table'

export default async function ServicesPage() {
  const result = await getAllServices({ page: 1, limit: 100, sortBy: 'sort_order', sortOrder: 'asc' })
  const services = result.data ?? []

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto min-w-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tight">Services</h1>
        <p className="text-text-secondary text-sm">Manage the services you offer to clients.</p>
      </div>

      <ServicesTable initialServices={services} />
    </div>
  )
}
