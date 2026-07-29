import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Calendar, Users, Trash2, QrCode } from 'lucide-react'

function ClassList({ classes, isLoading, memberCounts, onDelete, isAdmin }) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm animate-pulse">
            <div className="h-5 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3 mb-6">
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            </div>
            <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
          </div>
        ))}
      </div>
    )
  }

  if (classes.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Tidak Ada Kelas</h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Belum ada kelas yang dibuat untuk filter ini. Silakan buat kelas baru untuk memulai sesi presensi.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map(cls => {
        const totalMembers = memberCounts[cls.divisi] || 0
        const dateObj = new Date(cls.date)
        const formattedDate = dateObj.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })

        return (
          <div key={cls.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700">
                {cls.divisi}
              </span>
              {isAdmin && (
                <button
                  onClick={() => onDelete(cls.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Hapus Kelas"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-1" title={cls.name}>
              {cls.name}
            </h3>

            <div className="space-y-2.5 mb-6 flex-grow">
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{cls.start_time.slice(0, 5)} - {cls.end_time.slice(0, 5)} WIB</span>
              </div>
              {cls.location && (
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="line-clamp-1">{cls.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <Users className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Total Divisi: {totalMembers} Anggota</span>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => navigate(`/classes/${cls.id}`)}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors mt-auto"
              >
                <QrCode className="w-4 h-4" />
                Detail Kelas
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ClassList
