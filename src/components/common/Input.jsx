export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        className={`
          w-full px-3 py-2 rounded-lg border text-sm transition-shadow
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  )
}
