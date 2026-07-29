import { useState } from 'react'
import { Plus, Search, FilterX } from 'lucide-react'
import { useClasses, useDeleteClass } from '../hooks/useClasses'
import { useMembers } from '../hooks/useMembers'
import { DIVISI_CODE } from '../lib/memberid'
import ClassList from '../components/classes/ClassList'
import ClassForm from '../components/classes/ClassForm'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { useAuthStore } from '../store/useAuthStore'

const DIVISION_OPTIONS = Object.keys(DIVISI_CODE)

function Classes() {
  const { data: classes = [], isLoading } = useClasses()
  const { data: members = [] } = useMembers()
  const { mutate: deleteClass, isPending: isDeleting } = useDeleteClass()
  const profile = useAuthStore((state) => state.profile)
  const isAdmin = profile?.role === 'admin' || profile?.role === 'operator'

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  
  // Filters
  const [divisiFilter, setDivisiFilter] = useState('')
  const [searchFilter, setSearchFilter] = useState('')

  // Compute members count per division
  const memberCounts = members.reduce((acc, m) => {
    acc[m.divisi] = (acc[m.divisi] || 0) + 1
    return acc
  }, {})

  const filteredClasses = classes.filter(c => {
    if (divisiFilter && c.divisi !== divisiFilter) return false
    if (searchFilter && !c.name.toLowerCase().includes(searchFilter.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manajemen Kelas</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola kelas dan sesi absensi per divisi.</p>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            Buat Kelas
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama kelas..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        
        <div className="sm:w-48">
          <select
            value={divisiFilter}
            onChange={(e) => setDivisiFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%2364748b\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
          >
            <option value="">Semua Divisi</option>
            {DIVISION_OPTIONS.map(div => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>

        {(searchFilter || divisiFilter) && (
          <button
            onClick={() => { setSearchFilter(''); setDivisiFilter('') }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors"
            title="Reset Filter"
          >
            <FilterX className="w-4 h-4" />
            <span className="sm:hidden">Reset Filter</span>
          </button>
        )}
      </div>

      {/* Class List */}
      <ClassList 
        classes={filteredClasses} 
        isLoading={isLoading} 
        memberCounts={memberCounts}
        onDelete={(id) => setDeleteId(id)}
        isAdmin={isAdmin}
      />

      {/* Form Dialog */}
      <ClassForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          deleteClass(deleteId)
          setDeleteId(null)
        }}
        title="Hapus Kelas?"
        description="Apakah Anda yakin ingin menghapus kelas ini? Semua data absensi yang terkait dengan kelas ini juga akan terhapus secara permanen."
        confirmText="Hapus Kelas"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default Classes
