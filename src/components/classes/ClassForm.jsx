import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { X, Loader2 } from 'lucide-react'
import { DIVISI_CODE } from '../../lib/memberid'
import { useAddClass } from '../../hooks/useClasses'
import { useAuthStore } from '../../store/useAuthStore'

const DIVISION_OPTIONS = Object.keys(DIVISI_CODE)

function ClassForm({ isOpen, onClose }) {
  const { mutate: addClass, isPending } = useAddClass()
  const user = useAuthStore(state => state.user)

  const [formData, setFormData] = useState({
    name: '',
    divisi: '',
    date: '',
    start_time: '',
    end_time: '',
    location: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      divisi: '',
      date: '',
      start_time: '',
      end_time: '',
      location: ''
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addClass({
      ...formData,
      created_by: user?.id
    }, {
      onSuccess: () => {
        handleClose()
      }
    })
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="flex justify-between items-center p-5 border-b border-slate-100">
            <Dialog.Title className="text-lg font-bold text-slate-900">
              Buat Kelas Baru
            </Dialog.Title>
            <button
              onClick={handleClose}
              disabled={isPending}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Kelas *</label>
              <input
                required
                type="text"
                placeholder="Contoh: Pertemuan 1 - HTML & CSS"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Divisi *</label>
              <select
                required
                value={formData.divisi}
                onChange={(e) => setFormData({ ...formData, divisi: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="" disabled>Pilih Divisi</option>
                {DIVISION_OPTIONS.map(div => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal *</label>
              <input
                required
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jam Mulai *</label>
                <input
                  required
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jam Selesai *</label>
                <input
                  required
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lokasi</label>
              <input
                type="text"
                placeholder="Contoh: Ruang V.301"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Buat Kelas
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default ClassForm
