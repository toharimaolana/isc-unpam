import { CheckCircle2, Clock, ScanBarcode } from 'lucide-react'
import { AbsenStatusChip } from './AbsenStatusChip'

function AbsenTable({ attendances = [] }) {
  if (attendances.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-10 text-center">
        <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-1">Belum Ada Presensi</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          Daftar anggota yang hadir akan muncul di sini setelah scan berhasil.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold">Nama Anggota</th>
              <th className="px-4 py-3 font-semibold text-center">Status</th>
              <th className="px-4 py-3 font-semibold text-center">Waktu Scan</th>
              <th className="px-4 py-3 font-semibold text-center">Metode</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {attendances.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{item.members?.name}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{item.member_id}</p>
                </td>
                <td className="px-4 py-3 text-center">
                  <AbsenStatusChip status={item.status} />
                </td>
                <td className="px-4 py-3 text-center font-mono text-slate-600">
                  {item.scanned_at ? new Date(item.scanned_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  {item.method === 'barcode' ? (
                    <span className="inline-flex items-center justify-center p-1.5 bg-blue-50 text-blue-600 rounded-lg" title="Scan Barcode">
                      <ScanBarcode className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center p-1.5 bg-slate-100 text-slate-600 rounded-lg" title="Manual">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AbsenTable
