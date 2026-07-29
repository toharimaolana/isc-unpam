import { CheckCircle2, ScanBarcode, UserCheck, Stethoscope, Clock } from 'lucide-react'
import { AbsenStatusChip } from './AbsenStatusChip'

function ComprehensiveAbsenTable({ membersInDivisi = [], attendances = [], onManualAbsen }) {
  if (membersInDivisi.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-10 text-center">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Tidak Ada Anggota Divisi</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          Belum ada anggota yang terdaftar di divisi ini.
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
              <th className="px-4 py-3 font-semibold text-center">Metode / Aksi Manual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {membersInDivisi.map((member) => {
              const attendance = attendances.find(a => a.member_id === member.id)

              return (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{member.id}</p>
                  </td>
                  
                  <td className="px-4 py-3 text-center">
                    {attendance ? (
                      <AbsenStatusChip status={attendance.status} />
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                        Belum Presensi
                      </span>
                    )}
                  </td>
                  
                  <td className="px-4 py-3 text-center font-mono text-slate-600">
                    {attendance?.scanned_at 
                      ? new Date(attendance.scanned_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
                      : '-'}
                  </td>
                  
                  <td className="px-4 py-3 text-center">
                    {attendance ? (
                      // Jika sudah absen, tampilkan metode
                      attendance.method === 'barcode' ? (
                        <span className="inline-flex items-center justify-center p-1.5 bg-blue-50 text-blue-600 rounded-lg" title="Scan Barcode">
                          <ScanBarcode className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center p-1.5 bg-slate-100 text-slate-600 rounded-lg" title="Manual">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      )
                    ) : (
                      // Jika belum absen, tampilkan tombol manual
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onManualAbsen(member.id, 'hadir')}
                          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-200 transition-colors"
                          title="Hadir"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Hadir
                        </button>
                        <button
                          onClick={() => onManualAbsen(member.id, 'izin')}
                          className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-semibold border border-amber-200 transition-colors"
                          title="Izin"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Izin
                        </button>
                        <button
                          onClick={() => onManualAbsen(member.id, 'sakit')}
                          className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold border border-rose-200 transition-colors"
                          title="Sakit"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                          Sakit
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ComprehensiveAbsenTable
