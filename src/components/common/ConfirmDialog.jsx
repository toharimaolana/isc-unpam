import { AlertCircle, X, Loader2 } from 'lucide-react'
import { Button } from './Button'

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  description,
  confirmText = 'Ya',
  cancelText = 'Batal',
  isLoading = false,
  variant = 'danger' // danger | warning | primary
}) {
  if (!isOpen) return null

  const variantStyles = {
    danger: {
      icon: <AlertCircle className="w-6 h-6 shrink-0 text-rose-500" />,
      buttonVariant: 'danger',
      titleColor: 'text-rose-600',
    },
    warning: {
      icon: <AlertCircle className="w-6 h-6 shrink-0 text-amber-500" />,
      buttonVariant: 'primary', // maybe a warning button if we had one
      titleColor: 'text-amber-600',
    },
    primary: {
      icon: <AlertCircle className="w-6 h-6 shrink-0 text-blue-500" />,
      buttonVariant: 'primary',
      titleColor: 'text-blue-600',
    }
  }

  const currentVariant = variantStyles[variant] || variantStyles.danger

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 flex flex-col gap-5 max-w-sm w-full animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className={`p-2 rounded-full ${variant === 'danger' ? 'bg-rose-50' : variant === 'warning' ? 'bg-amber-50' : 'bg-blue-50'}`}>
              {currentVariant.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              {description && (
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={currentVariant.buttonVariant}
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
