import { QrCode, Edit2, Trash2 } from 'lucide-react'

export function MemberCard({ member, onEdit, onDelete, onToggleStatus, onShowBarcode }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-slate-900">{member.name}</h3>
          <p className="text-xs font-mono text-slate-500 mt-0.5">{member.id}</p>
        </div>
        <button
          onClick={() => onShowBarcode(member)}
          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          title="Tampilkan Barcode"
        >
          <QrCode className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mt-1">
        <div>
          <p className="text-slate-500 text-xs">Divisi</p>
          <p className="font-medium text-slate-700">{member.divisi}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">Angkatan</p>
          <p className="font-medium text-slate-700">{member.angkatan || '-'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
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

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(member)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(member)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
