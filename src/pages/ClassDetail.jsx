import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, QrCode, Calendar, Clock, MapPin, Users } from 'lucide-react'
import { useClass } from '../hooks/useClasses'
import { useAttendancesByClass, useManualAbsen } from '../hooks/useAttendances'
import { useRealtimeAbsen } from '../hooks/useRealtimeAbsen'
import { useMembers } from '../hooks/useMembers'
import ComprehensiveAbsenTable from '../components/absen/ComprehensiveAbsenTable'
import toast from 'react-hot-toast'

function ClassDetail() {
  const { classId } = useParams()
  const navigate = useNavigate()

  // Hooks
  useRealtimeAbsen(classId)
  const { data: activeClass, isLoading: loadingClass } = useClass(classId)
  const { data: members = [] } = useMembers()
  const { data: attendances = [] } = useAttendancesByClass(classId)
  const { mutateAsync: manualAbsen } = useManualAbsen()

  // Local State
  const [isMarking, setIsMarking] = useState(false)

  // Computation
  const membersInDivisi = members.filter(m => m.divisi === activeClass?.divisi && m.is_active)
  const totalMembers = membersInDivisi.length
  const hadir = attendances.filter(a => a.status === 'hadir').length
  const izin = attendances.filter(a => a.status === 'izin').length
  const sakit = attendances.filter(a => a.status === 'sakit').length
  const belum = totalMembers - (hadir + izin + sakit)

  const handleManualAbsen = async (memberId, status) => {
    setIsMarking(true)
    try {
      await manualAbsen({ class_id: classId, member_id: memberId, status, notes: '' })
      toast.success(`Berhasil menandai status: ${status}`)
    } catch (error) {
      if (error.message === 'DUPLICATE') {
        toast.error('Anggota tersebut sudah memiliki riwayat presensi.')
      } else {
        toast.error('Gagal mencatat presensi: ' + error.message)
      }
    } finally {
      setIsMarking(false)
    }
  }

  if (loadingClass) {
    return <div className="p-8 text-center text-slate-500 font-semibold animate-pulse">Memuat detail kelas...</div>
  }

  if (!activeClass) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Kelas Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-6">Kelas yang Anda cari mungkin sudah dihapus atau URL tidak valid.</p>
        <button onClick={() => navigate('/classes')} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          Kembali ke Manajemen Kelas
        </button>
      </div>
    )
  }

  const dateObj = new Date(activeClass.date)
  const formattedDate = dateObj.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header & Nav */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/classes')} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{activeClass.name}</h1>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700">
                {activeClass.divisi}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium mt-0.5">Detail Sesi Kelas</p>
          </div>
        </div>
        
        <button
          onClick={() => navigate(`/scan?classId=${classId}`)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <QrCode className="w-4 h-4" />
          Buka Scanner
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Anggota</span>
          <span className="text-2xl font-bold text-slate-900">{totalMembers}</span>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-center">
          <span className="text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">Hadir</span>
          <span className="text-2xl font-bold text-emerald-700">{hadir}</span>
        </div>
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-center">
          <span className="text-amber-600 text-xs font-semibold uppercase tracking-wider mb-1">Izin</span>
          <span className="text-2xl font-bold text-amber-700">{izin}</span>
        </div>
        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-center">
          <span className="text-rose-600 text-xs font-semibold uppercase tracking-wider mb-1">Sakit</span>
          <span className="text-2xl font-bold text-rose-700">{sakit}</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Belum Hadir</span>
          <span className="text-2xl font-bold text-slate-700">{belum < 0 ? 0 : belum}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Informasi Sesi</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Tanggal</p>
                  <p className="text-sm text-slate-500">{formattedDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Waktu</p>
                  <p className="text-sm text-slate-500">{activeClass.start_time.slice(0, 5)} - {activeClass.end_time.slice(0, 5)} WIB</p>
                </div>
              </div>
              {activeClass.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Lokasi</p>
                    <p className="text-sm text-slate-500">{activeClass.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Daftar Kehadiran Anggota
            </h2>
          </div>
          <ComprehensiveAbsenTable 
            membersInDivisi={membersInDivisi} 
            attendances={attendances} 
            onManualAbsen={handleManualAbsen}
          />
        </div>
      </div>
    </div>
  )
}

export default ClassDetail
