export function AbsenStatusChip({ status }) {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'hadir':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'izin':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'sakit':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getStyles()}`}>
      {status || 'Hadir'}
    </span>
  )
}
