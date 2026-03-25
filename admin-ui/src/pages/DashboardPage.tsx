import { Building2, Users, UserCheck, FileText, Receipt, TrendingUp } from 'lucide-react'
import { StatsCard } from '../components/ui'

const STATS = [
  { title: 'Total Properties',  value: '248',    change: 12,  icon: Building2, color: 'indigo'  as const },
  { title: 'Active Clients',    value: '1,024',  change: 8,   icon: Users,     color: 'green'   as const },
  { title: 'Open Leads',        value: '73',     change: -3,  icon: UserCheck, color: 'amber'   as const },
  { title: 'Active Contracts',  value: '34',     change: 5,   icon: FileText,  color: 'purple'  as const },
  { title: 'Invoices Pending',  value: '17',     change: -10, icon: Receipt,   color: 'red'     as const },
  { title: 'Monthly Revenue',   value: '$82.4K', change: 21,  icon: TrendingUp,color: 'sky'     as const },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back — here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {STATS.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Recent Activity</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500">Activity feed coming soon…</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Quick Actions</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500">Quick action shortcuts coming soon…</p>
        </div>
      </div>
    </div>
  )
}
