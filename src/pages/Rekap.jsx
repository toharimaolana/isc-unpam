import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, FilterX, LibraryBig } from 'lucide-react'
import Papa from 'papaparse'
import { useRekapAbsensi } from '../hooks/useAttendances'
import { supabase } from '../lib/supabase'
import { DIVISI_CODE } from '../lib/memberid'
import { AbsenStatusChip } from '../components/absen/AbsenStatusChip'

const DIVISION_OPTIONS = Object.keys(DIVISI_CODE)

function Rekap() {
  const { data: attendances = [], isLoading, error } = useRekapAbsensi()

  // Filter states
  const [classFilter, setClassFilter] = useState('')
  const [divisiFilter, setDivisiFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  // Fetch classes for dropdown filter
  const { data: classes = [], isLoading: loadingClasses } = useQuery({
    queryKey: ['rekapClassesDropdown'],
    queryFn: async () => {
      const { data, error: dbError } = await supabase
        .from('classes')
        .select('id, name')
        .order('date', { ascending: false })
      if (dbError) throw dbError
      return data || []
    },
  })

  // Filter application logic
  const filteredAttendances = attendances.filter((item) => {
    if (classFilter && item.class_id !== classFilter) return false
    if (divisiFilter && item.members?.divisi !== divisiFilter) return false
    if (dateFilter) {
      const classDateStr = item.classes?.date // format "YYYY-MM-DD"
      if (classDateStr !== dateFilter) return false
    }
    return true
  })

  const handleResetFilters = () => {
    setClassFilter('')
    setDivisiFilter('')
    setDateFilter('')
  }

  const handleExportCSV = () => {
    if (filteredAttendances.length === 0) return

    const csvData = filteredAttendances.map((item) => ({
      'ID Anggota': item.member_id,
      'Nama Lengkap': item.members?.name || '',
      'NIM': item.members?.nim || '-',
      'Divisi Anggota': item.members?.divisi || '',
      'Kelas': item.classes?.name || '',
      'Divisi Kelas': item.classes?.divisi || '',
      'Tanggal Kelas': item.classes?.date ? new Date(item.classes.date).toLocaleDateString('id-ID') : '',
      'Status Kehadiran': item.status || 'Hadir',
      'Waktu Presensi': item.scanned_at ? new Date(item.scanned_at).toLocaleTimeString('id-ID') : '',
      'Metode Presensi': item.method === 'barcode' ? 'Scan Barcode' : 'Manual',
    }))

    const csv = Papa.unparse(csvData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `rekap_absen_${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rekap Absensi Komunitas</h1>
          <p className="text-slate-500 text-sm mt-1">Lihat rekap presensi anggota, filter segmentasi kelas/divisi, dan ekspor CSV.</p>
        </div>
        
        <button
          onClick={handleExportCSV}
          disabled={filteredAttendances.length === 0}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Ekspor CSV
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-sm font-semibold">
          Gagal mengambil lembar rekapitulasi dari database.
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-slate-900 font-bold mb-4 text-sm">
          <LibraryBig className="w-4 h-4 text-blue-600" />
          Saring Lembar Kehadiran
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Pilih Kelas</label>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              disabled={loadingClasses}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%2364748b\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="">Semua Kelas</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Pilih Divisi</label>
            <select
              value={divisiFilter}
              onChange={(e) => setDivisiFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%2364748b\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="">Semua Divisi</option>
              {DIVISION_OPTIONS.map((div) => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Tanggal Kelas</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              disabled={!classFilter && !divisiFilter && !dateFilter}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[38px]"
            >
              <FilterX className="w-4 h-4" />
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nama Lengkap</th>
                  <th className="px-4 py-3 font-semibold">Divisi Anggota</th>
                  <th className="px-4 py-3 font-semibold">Kelas</th>
                  <th className="px-4 py-3 font-semibold text-center">Status</th>
                  <th className="px-4 py-3 font-semibold">Waktu Scan</th>
                  <th className="px-4 py-3 font-semibold text-center">Metode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAttendances.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500 font-medium">
                      Tidak ada catatan presensi yang memenuhi filter pencarian Anda.
                    </td>
                  </tr>
                ) : (
                  filteredAttendances.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {item.members?.name || 'Anggota Terhapus'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {item.members?.divisi || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{item.classes?.name || '-'}</div>
                        {item.classes?.date && (
                          <div className="text-xs text-slate-500">
                            {new Date(item.classes.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <AbsenStatusChip status={item.status} />
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {item.scanned_at ? new Date(item.scanned_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.method === 'barcode' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                          {item.method || 'Manual'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Rekap
