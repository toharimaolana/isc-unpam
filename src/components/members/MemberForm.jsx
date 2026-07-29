import { X, Loader2 } from 'lucide-react'
import { Button, Input, Select } from '../common'

export function MemberForm({
  isOpen,
  onClose,
  isEditMode,
  isSubmitting,
  formData,
  setFormData,
  handleFieldChange,
  handleSubmit,
  angkatanOptions,
  divisionOptions
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">
            {isEditMode ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-5">
          {!isEditMode && (
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Angkatan"
                value={formData.angkatan}
                onChange={(e) => handleFieldChange('angkatan', e.target.value)}
                options={angkatanOptions}
              />
              <Select
                label="Divisi"
                value={formData.divisi}
                onChange={(e) => handleFieldChange('divisi', e.target.value)}
                options={divisionOptions}
              />
              <div className="col-span-2 space-y-1.5">
                <Input
                  label="Generated Member ID"
                  value={formData.generatedId}
                  readOnly
                  className="bg-slate-50 border-slate-200 text-blue-600 font-mono font-bold"
                />
                <p className="text-xs text-slate-500 font-medium">
                  ID Anggota digenerate otomatis berdasarkan segmentasi Angkatan & Divisi.
                </p>
              </div>
            </div>
          )}

          {isEditMode && (
            <div className="space-y-1.5">
              <Input
                label="Member ID"
                value={formData.generatedId}
                readOnly
                className="bg-slate-50 border-slate-200 text-blue-600 font-mono font-bold"
              />
            </div>
          )}

          <Input
            label="Nama Lengkap *"
            required
            placeholder="Rian Mahendra"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="NIM"
              placeholder="2021081023"
              value={formData.nim}
              onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
              disabled={isSubmitting}
            />
            <Input
              label="Nomor Telepon"
              placeholder="0812XXXXXXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <Input
            label="Alamat Email"
            type="email"
            placeholder="rian@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={isSubmitting}
          />

          <div className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              id="isActiveCheck"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="isActiveCheck" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
              Anggota Aktif
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            {isEditMode ? 'Simpan Perubahan' : 'Tambah Anggota'}
          </Button>
        </div>
      </div>
    </div>
  )
}
