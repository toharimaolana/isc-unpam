const colors = {
  hadir: 'bg-green-100 text-green-700',
  izin: 'bg-yellow-100 text-yellow-700',
  sakit: 'bg-red-100 text-red-700',
  aktif: 'bg-blue-100 text-blue-700',
  nonaktif: 'bg-gray-100 text-gray-600',
}

export function Badge({ status, label }) {
  const normalizedStatus = String(status || '').toLowerCase()
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[normalizedStatus] || colors.nonaktif}`}>
      {label || status}
    </span>
  )
}
