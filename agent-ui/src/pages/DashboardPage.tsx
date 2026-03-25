import { Building2, UserCheck, Users, FileText, Activity, TrendingUp } from 'lucide-react'
import { StatsCard } from '../components/ui'
import { useAuth } from '../context/AuthContext'

const STATS = [
  { title: 'My Listings',       value: '12',    change: 2,   icon: Building2,  color: 'indigo' as const },
  { title: 'Active Leads',      value: '28',    change: 5,   icon: UserCheck,  color: 'amber'  as const },
  { title: 'My Clients',        value: '47',    change: 3,   icon: Users,      color: 'green'  as const },
  { title: 'Open Contracts',    value: '6',     change: 1,   icon: FileText,   color: 'purple' as const },
  { title: 'Activities Today',  value: '9',     change: -2,  icon: Activity,   color: 'sky'    as const },
  { title: 'Monthly Revenue',   value: '$24.1K',change: 18,  icon: TrendingUp, color: 'green'  as const },
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here's a snapshot of your activity today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {STATS.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Recent Activities</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500">Activity feed coming soon…</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Upcoming Tasks</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500">Task list coming soon…</p>
        </div>
      </div>
    </div>
  )
}
