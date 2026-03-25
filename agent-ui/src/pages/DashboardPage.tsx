import { Building2, UserCheck, Users, FileText, Activity, TrendingUp } from 'lucide-react'
import { StatsCard } from '../components/ui'
import {
  LeadPipeline,
  TodayFollowUps,
  RecentActivities,
  UpcomingTasks,
  PerformanceComparison,
  QuickActions,
  NotificationsPanel,
} from '../components/dashboard'
import { useAuth } from '../context/AuthContext'

const STATS = [
  { title: 'My Listings',       value: '12',    change: 2,   icon: Building2,  color: 'indigo' as const },
  { title: 'Active Leads',      value: '28',    change: 5,   icon: UserCheck,  color: 'amber'  as const },
  { title: 'My Clients',        value: '47',    change: 3,   icon: Users,      color: 'green'  as const },
  { title: 'Open Contracts',    value: '6',     change: 1,   icon: FileText,   color: 'purple' as const },
  { title: 'Activities Today',  value: '9',     change: -2,  icon: Activity,   color: 'sky'    as const },
  { title: 'Monthly Revenue',   value: 'EGP 1.85M', change: 18, icon: TrendingUp, color: 'green' as const },
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here's a snapshot of your activity today.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {STATS.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      {/* Lead Pipeline — full width */}
      <LeadPipeline />

      {/* Main content: 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column — wider */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <TodayFollowUps />
          <RecentActivities />
          <PerformanceComparison />
        </div>

        {/* Right column — sidebar */}
        <div className="flex flex-col gap-4">
          <QuickActions />
          <UpcomingTasks />
          <NotificationsPanel />
        </div>
      </div>
    </div>
  )
}
