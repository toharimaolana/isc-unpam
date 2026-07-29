export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-slate-400">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  )
}
