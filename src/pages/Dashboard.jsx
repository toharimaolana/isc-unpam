import { useQuery } from '@tanstack/react-query'
import { Users, Calendar, CheckSquare, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Card, Skeleton } from '../components/common'

function StatCard({ title, value, icon: Icon, loading, error, iconColorClass, bgColorClass }) {
  if (error) {
    return (
      <Card className="border-red-100 bg-red-50/50 flex items-center gap-3 p-6">
        <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
        <span className="text-sm font-medium text-red-700">Gagal memuat data</span>
      </Card>
    )
  }

  return (
    <Card className="hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-center justify-between p-6 bg-white border border-slate-200/60 rounded-xl">
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        {loading ? (
          <Skeleton className="h-9 w-16" />
        ) : (
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {value}
          </h2>
        )}
      </div>
      <div className={`p-4 rounded-xl ${bgColorClass} ${iconColorClass} shrink-0 shadow-xs`}>
        <Icon className="w-6 h-6" />
      </div>
    </Card>
  )
}

function Dashboard() {
  // 1. Fetch active members count
  const { data: activeMembersCount, isLoading: loadingMembers, error: errorMembers } = useQuery({
    queryKey: ['activeMembersCount'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('id')
        .eq('is_active', true)
      
      if (error) throw error
      return data?.length || 0
    }
  })

  // 2. Fetch classes this month
  const { data: classesMonthCount, isLoading: loadingClasses, error: errorClasses } = useQuery({
    queryKey: ['classesMonthCount'],
    queryFn: async () => {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      
      const endOfMonth = new Date()
      endOfMonth.setMonth(endOfMonth.getMonth() + 1)
      endOfMonth.setDate(0)
      endOfMonth.setHours(23, 59, 59, 999)

      const startStr = startOfMonth.toISOString().split('T')[0]
      const endStr = endOfMonth.toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('classes')
        .select('id')
        .gte('date', startStr)
        .lte('date', endStr)

      if (error) throw error
      return data?.length || 0
    }
  })

  // 3. Fetch attendances today
  const { data: attendancesTodayCount, isLoading: loadingAttendances, error: errorAttendances } = useQuery({
    queryKey: ['attendancesTodayCount'],
    queryFn: async () => {
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from('attendances')
        .select('id')
        .gte('scanned_at', startOfToday.toISOString())

      if (error) throw error
      return data?.length || 0
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Ringkasan Dashboard
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-slate-500 font-medium">
          Selamat datang di portal administrasi AbsenKu. Berikut rangkuman aktivitas komunitas Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Anggota Aktif"
          value={activeMembersCount}
          icon={Users}
          loading={loadingMembers}
          error={errorMembers}
          iconColorClass="text-blue-600"
          bgColorClass="bg-blue-50"
        />
        <StatCard
          title="Kelas Bulan Ini"
          value={classesMonthCount}
          icon={Calendar}
          loading={loadingClasses}
          error={errorClasses}
          iconColorClass="text-purple-600"
          bgColorClass="bg-purple-50"
        />
        <StatCard
          title="Kehadiran Hari Ini"
          value={attendancesTodayCount}
          icon={CheckSquare}
          loading={loadingAttendances}
          error={errorAttendances}
          iconColorClass="text-emerald-600"
          bgColorClass="bg-emerald-50"
        />
      </div>
    </div>
  )
}

export default Dashboard
