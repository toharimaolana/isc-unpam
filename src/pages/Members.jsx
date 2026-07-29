import { useState } from 'react'
import { UserPlus, AlertCircle, Users } from 'lucide-react'
import { useMembers, useAddMember, useUpdateMember, useDeleteMember } from '../hooks/useMembers'
import { generateMemberID, isMemberIDValid, DIVISI_CODE, getSemesterExpiryDate } from '../lib/memberid'
import { supabase } from '../lib/supabase'
import BarcodeCard from '../components/barcode/BarcodeCard'
import { Button, ConfirmDialog, EmptyState, LoadingSkeleton } from '../components/common'
import { MemberTable } from '../components/members/MemberTable'
import { MemberForm } from '../components/members/MemberForm'
import toast from 'react-hot-toast'

const DIVISION_OPTIONS = Object.keys(DIVISI_CODE).map(key => ({ value: key, label: key }))
const ANGKATAN_OPTIONS = ['2023', '2024', '2025', '2026'].map(year => ({ value: year, label: year }))

function Members() {
  const { data: members = [], isLoading, error } = useMembers()
  const addMember = useAddMember()
  const updateMember = useUpdateMember()
  const deleteMember = useDeleteMember()
  
  const isAdding = addMember.isPending
  const isUpdating = updateMember.isPending
  const isDeleting = deleteMember.isPending

  // Dialog states
  const [openForm, setOpenForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [openBarcode, setOpenBarcode] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  
  const [selectedMember, setSelectedMember] = useState(null)
  const [memberToDelete, setMemberToDelete] = useState(null)

  // Form Data State
  const [formData, setFormData] = useState({
    id: '', // selected id for edit
    name: '',
    divisi: DIVISION_OPTIONS[0].value,
    angkatan: ANGKATAN_OPTIONS[ANGKATAN_OPTIONS.length - 1].value,
    email: '',
    nim: '',
    phone: '',
    isActive: true,
    generatedId: ''
  })

  const handleOpenAdd = () => {
    setEditMode(false)
    const initialAngkatan = ANGKATAN_OPTIONS[ANGKATAN_OPTIONS.length - 1].value
    const initialDivisi = DIVISION_OPTIONS[0].value
    
    setFormData({
      id: '',
      name: '',
      divisi: initialDivisi,
      angkatan: initialAngkatan,
      email: '',
      nim: '',
      phone: '',
      isActive: true,
      generatedId: ''
    })
    setOpenForm(true)
    handleGenerateId(initialAngkatan, initialDivisi)
  }

  const handleOpenEdit = (member) => {
    setEditMode(true)
    setFormData({
      id: member.id,
      name: member.name,
      divisi: member.divisi,
      angkatan: member.angkatan || '',
      email: member.email || '',
      nim: member.nim || '',
      phone: member.phone || '',
      isActive: member.is_active,
      generatedId: member.id
    })
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
  }

  const handleOpenBarcode = (member) => {
    setSelectedMember(member)
    setOpenBarcode(true)
  }

  const handleCloseBarcode = () => {
    setOpenBarcode(false)
    setSelectedMember(null)
  }

  const handleOpenDelete = (member) => {
    setMemberToDelete(member)
    setOpenDelete(true)
  }

  const handleCloseDelete = () => {
    setOpenDelete(false)
    setMemberToDelete(null)
  }

  const handleConfirmDelete = () => {
    if (!memberToDelete) return
    deleteMember.mutate(memberToDelete.id, {
      onSuccess: () => {
        handleCloseDelete()
      }
    })
  }

  // Pre-generate Member ID based on Angkatan & Divisi
  const handleGenerateId = async (currentAngkatan, currentDivisi) => {
    if (!currentAngkatan || !currentDivisi) return
    
    try {
      const tahunStr = String(currentAngkatan).slice(-2)
      const codeDiv = DIVISI_CODE[currentDivisi] || '99'
      const prefix = `ISC${tahunStr}${codeDiv}`

      // Set fallback ID instantly
      const fallbackId = generateMemberID(currentAngkatan, currentDivisi, 1)
      setFormData(prev => ({ ...prev, generatedId: fallbackId }))

      // Fetch existing members in the same segment
      const { data, error: dbError } = await supabase
        .from('members')
        .select('id')
        .like('id', `${prefix}%`)

      if (dbError) throw dbError

      let nextIndex = 1
      if (data && data.length > 0) {
        const indexes = data.map((m) => {
          const suffix = m.id.slice(7)
          const parsed = parseInt(suffix, 10)
          return isNaN(parsed) ? 0 : parsed
        })
        nextIndex = Math.max(...indexes, 0) + 1
      }

      const preId = generateMemberID(currentAngkatan, currentDivisi, nextIndex)
      setFormData(prev => ({ ...prev, generatedId: preId }))
    } catch (err) {
      console.error('Gagal generate Member ID:', err)
      toast.error('Gagal sinkronisasi ID. Error: ' + err.message)
    }
  }

  const handleFieldChange = (field, val) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: val }
      
      if (!editMode) {
        if (field === 'angkatan') handleGenerateId(val, prev.divisi)
        else if (field === 'divisi') handleGenerateId(prev.angkatan, val)
      }
      
      return newData
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Nama wajib diisi.')
      return
    }

    let finalId = formData.generatedId
    if (!editMode) {
      if (!finalId) {
        toast.error('ID Anggota belum siap.')
        return
      }
    }

    if (!isMemberIDValid(finalId)) {
      toast.error(`ID Anggota "${finalId}" tidak valid.`)
      return
    }

    if (editMode) {
      updateMember.mutate({
        id: formData.id,
        name: formData.name,
        divisi: formData.divisi,
        angkatan: formData.angkatan,
        email: formData.email.trim() || null,
        nim: formData.nim.trim() || null,
        phone: formData.phone.trim() || null,
        is_active: formData.isActive,
      }, {
        onSuccess: () => {
          handleCloseForm()
        }
      })
    } else {
      const expiryDate = getSemesterExpiryDate()
      addMember.mutate({
        id: finalId,
        name: formData.name,
        divisi: formData.divisi,
        angkatan: formData.angkatan,
        email: formData.email.trim() || null,
        nim: formData.nim.trim() || null,
        phone: formData.phone.trim() || null,
        is_active: formData.isActive,
        barcode_expires_at: expiryDate.toISOString().split('T')[0],
      }, {
        onSuccess: () => {
          handleCloseForm()
        }
      })
    }
  }

  const handleToggleStatus = (member) => {
    updateMember.mutate({
      id: member.id,
      is_active: !member.is_active,
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Anggota
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Kelola data anggota komunitas ISC UNPAM, generate barcode, dan status keaktifan.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="shrink-0 shadow-sm">
          <UserPlus className="w-5 h-5 mr-1" />
          Tambah Anggota
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-600">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{error.message || 'Gagal memuat data anggota.'}</span>
        </div>
      )}

      {/* Info Total Data */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 font-medium">
          Total <span className="font-bold text-slate-900">{members.length}</span> anggota terdaftar
        </p>
      </div>

      {/* Members Content */}
      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : members.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title="Belum Ada Anggota"
          description="Sistem belum memiliki data anggota. Silakan tambahkan anggota pertama Anda menggunakan tombol di atas."
          action={
            <Button onClick={handleOpenAdd}>
              <UserPlus className="w-5 h-5 mr-1" />
              Tambah Data
            </Button>
          }
        />
      ) : (
        <MemberTable
          members={members}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onToggleStatus={handleToggleStatus}
          onShowBarcode={handleOpenBarcode}
        />
      )}

      {/* Modals & Dialogs */}
      <MemberForm
        isOpen={openForm}
        onClose={handleCloseForm}
        isEditMode={editMode}
        isSubmitting={isAdding || isUpdating}
        formData={formData}
        setFormData={setFormData}
        handleFieldChange={handleFieldChange}
        handleSubmit={handleSubmit}
        angkatanOptions={ANGKATAN_OPTIONS}
        divisionOptions={DIVISION_OPTIONS}
      />

      <ConfirmDialog
        isOpen={openDelete}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Hapus Anggota"
        description={`Apakah Anda yakin ingin menghapus ${memberToDelete?.name}? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        isLoading={isDeleting}
        variant="danger"
      />

      {/* Barcode Viewer Overlay */}
      {openBarcode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 flex flex-col gap-5 max-w-sm w-full animate-in zoom-in-95 duration-200">
            <div className="w-full flex justify-center">
              {selectedMember && <BarcodeCard member={selectedMember} />}
            </div>
            <Button variant="secondary" onClick={handleCloseBarcode} className="w-full">
              Tutup Kartu
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Members
