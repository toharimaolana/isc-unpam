import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, AlertTriangle, XCircle, ArrowLeft, Terminal } from 'lucide-react'
import { useClass } from '../hooks/useClasses'
import { useAttendancesByClass, useScanAbsen } from '../hooks/useAttendances'
import { useRealtimeAbsen } from '../hooks/useRealtimeAbsen'
import { useMembers } from '../hooks/useMembers'
import { useScanStore } from '../store/useScanStore'
import { isMemberIDValid, isBarcodeExpired, getSemesterExpiryDate } from '../lib/memberid'
import BarcodeScanner from '../components/barcode/BarcodeScanner'
import AbsenTable from '../components/absen/AbsenTable'

function Scan() {
  const [searchParams] = useSearchParams()
  const classId = searchParams.get('classId')
  const navigate = useNavigate()
  
  // Realtime hook
  useRealtimeAbsen(classId)

  // Data fetching
  const { data: activeClass, isLoading: loadingClass } = useClass(classId)
  const { data: attendances = [] } = useAttendancesByClass(classId)
  const { data: members = [] } = useMembers()
  const { mutateAsync: scanAbsen } = useScanAbsen()

  // Store
  const { scanning, setScanning, logs, addLog, clearLogs } = useScanStore()
  
  // Local state
  const [lastScanResult, setLastScanResult] = useState(null)
  
  // Calculate stats
  const classDivisi = activeClass?.divisi
  const membersInDivisi = members.filter(m => m.divisi === classDivisi)
  const totalMembers = membersInDivisi.length
  const totalHadir = attendances.length

  // Clear feedback after 3s
  useEffect(() => {
    if (lastScanResult) {
      const timer = setTimeout(() => setLastScanResult(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [lastScanResult])

  const handleScan = useCallback(async (scannedId) => {
    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

    if (!classId || !activeClass) {
      setLastScanResult({ type: 'error', message: 'Kelas tidak valid.' })
      return
    }

    // 1. Format ID valid
    if (!isMemberIDValid(scannedId)) {
      setLastScanResult({ type: 'error', message: `Format ID tidak valid: ${scannedId}` })
      addLog({ id: Date.now(), type: 'error', message: `Format ID tidak valid: ${scannedId}`, timestamp })
      return
    }

    // 2. Member ada di DB
    const member = members.find(m => m.id === scannedId)
    if (!member) {
      setLastScanResult({ type: 'error', message: `Anggota tidak terdaftar: ${scannedId}` })
      addLog({ id: Date.now(), type: 'error', message: `Anggota tidak terdaftar: ${scannedId}`, timestamp })
      return
    }

    if (!member.is_active) {
      setLastScanResult({ type: 'error', message: `Anggota non-aktif: ${member.name}` })
      addLog({ id: Date.now(), type: 'error', message: `Anggota non-aktif: ${member.name}`, timestamp })
      return
    }

    // Cek expired (Quick fix: Handle null untuk dummy data lama)
    const activeExpiryDate = member.barcode_expires_at || getSemesterExpiryDate().toISOString().split('T')[0]
    if (isBarcodeExpired(activeExpiryDate)) {
      setLastScanResult({ type: 'error', message: `Barcode expired: ${member.name}` })
      addLog({ id: Date.now(), type: 'error', message: `Barcode expired: ${member.name}`, timestamp })
      return
    }

    // 3. Divisi sesuai
    if (member.divisi !== activeClass.divisi) {
      setLastScanResult({ type: 'error', message: `Beda Divisi: ${member.name} (${member.divisi})` })
      addLog({ id: Date.now(), type: 'error', message: `Beda Divisi: ${member.name} (${member.divisi})`, timestamp })
      return
    }

    // 4. Belum absen (Duplicate Check & Insert via Mutate)
    try {
      await scanAbsen({ class_id: classId, member_id: scannedId })
      
      setLastScanResult({ type: 'success', message: `Berhasil Hadir: ${member.name}` })
      addLog({ id: Date.now(), type: 'success', message: `Berhasil Hadir: ${member.name}`, timestamp })
    } catch (err) {
      if (err.message === 'DUPLICATE') {
        setLastScanResult({ type: 'warning', message: `Sudah Hadir: ${member.name}` })
        addLog({ id: Date.now(), type: 'warning', message: `Sudah Hadir: ${member.name}`, timestamp })
      } else {
        setLastScanResult({ type: 'error', message: `Sistem Error: ${err.message}` })
        addLog({ id: Date.now(), type: 'error', message: `Sistem Error: ${err.message}`, timestamp })
      }
    }
  }, [classId, activeClass, members, scanAbsen, addLog])

  if (!classId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Pilih Kelas Terlebih Dahulu</h2>
        <p className="text-slate-500 mb-6 max-w-md">Silakan kembali ke halaman Manajemen Kelas untuk memilih kelas yang ingin Anda mulai sesi scan presensinya.</p>
        <button onClick={() => navigate('/classes')} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          Kembali ke Manajemen Kelas
        </button>
      </div>
    )
  }

  if (loadingClass) {
    return <div className="p-8 text-center text-slate-500 font-semibold animate-pulse">Memuat data kelas...</div>
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(`/classes/${classId}`)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 line-clamp-1">{activeClass?.name}</h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">Sesi Scan Presensi • {activeClass?.divisi}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Scanner */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
            <BarcodeScanner
              onScan={handleScan}
              scanning={scanning}
              setScanning={setScanning}
            />

            {/* Visual Feedback */}
            <div className="w-full mt-6 h-[80px]">
              {lastScanResult && (
                <div className={`w-full p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2
                  ${lastScanResult.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : ''}
                  ${lastScanResult.type === 'warning' ? 'bg-amber-50 border border-amber-200 text-amber-800' : ''}
                  ${lastScanResult.type === 'error' ? 'bg-rose-50 border border-rose-200 text-rose-800' : ''}
                `}>
                  {lastScanResult.type === 'success' && <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" />}
                  {lastScanResult.type === 'warning' && <AlertTriangle className="w-6 h-6 shrink-0 text-amber-600" />}
                  {lastScanResult.type === 'error' && <XCircle className="w-6 h-6 shrink-0 text-rose-600" />}
                  <span className="font-semibold text-sm leading-tight">{lastScanResult.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Logs */}
          <div className="bg-slate-900 rounded-2xl p-5 text-slate-300 shadow-sm overflow-hidden flex flex-col h-[280px]">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-sm">Log Sistem</h3>
              </div>
              <button onClick={clearLogs} className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">Clear</button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-2 pr-2 text-xs font-mono scrollbar-thin scrollbar-thumb-slate-700">
              {logs.length === 0 ? (
                <p className="text-slate-600 italic">Menunggu pemindaian barcode...</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="flex gap-2">
                    <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                    <span className={`
                      ${log.type === 'success' ? 'text-emerald-400' : ''}
                      ${log.type === 'warning' ? 'text-amber-400' : ''}
                      ${log.type === 'error' ? 'text-rose-400' : ''}
                    `}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Daftar Hadir */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Kehadiran Divisi</h2>
              <p className="text-slate-500 text-sm mt-0.5">Realtime update</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-center min-w-[120px]">
              <div className="text-2xl font-black text-blue-700 leading-none mb-1">
                {totalHadir} <span className="text-sm font-semibold text-blue-500">/ {totalMembers}</span>
              </div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Hadir</div>
            </div>
          </div>

          <div className="flex-grow flex flex-col min-h-0">
            <AbsenTable attendances={attendances} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Scan
