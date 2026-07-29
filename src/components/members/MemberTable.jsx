import { QrCode, Edit2, Trash2 } from 'lucide-react'
import { MemberCard } from './MemberCard'

export function MemberTable({ members, onEdit, onDelete, onToggleStatus, onShowBarcode }) {
  return (
    <>
      {/* Mobile View (Cards) */}
      <div className="md:hidden flex flex-col gap-3">
        {members.map(member => (
          <MemberCard
            key={member.id}
            member={member}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
            onShowBarcode={onShowBarcode}
          />
        ))}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden md:block w-full overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <th className="px-5 py-4 font-semibold w-16 text-center">No</th>
              <th className="px-5 py-4 font-semibold">Nama & ID</th>
              <th className="px-5 py-4 font-semibold">Divisi</th>
              <th className="px-5 py-4 font-semibold">Angkatan</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member, index) => (
              <tr key={member.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-5 py-4 text-slate-400 text-center">{index + 1}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{member.name}</p>
                      <p className="text-xs font-mono text-slate-500 mt-0.5">{member.id}</p>
                    </div>
                    <button
                      onClick={() => onShowBarcode(member)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Tampilkan Barcode"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                  </div>
                </td>
                <td className="px-5 py-4 font-medium text-slate-700">{member.divisi}</td>
                <td className="px-5 py-4 text-slate-600">{member.angkatan || '-'}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => onToggleStatus(member)}
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      member.is_active
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {member.is_active ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(member)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit anggota"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(member)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus anggota"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
