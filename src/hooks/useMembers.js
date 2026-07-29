import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

// Fetch semua member
export function useMembers() {
  return useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
  })
}

// Tambah member baru
export function useAddMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (memberData) => {
      const { data, error } = await supabase
        .from('members')
        .insert([memberData])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (newData) => {
      // Update cache lokal langsung agar UI berubah seketika tanpa menunggu loading server
      queryClient.setQueryData(['members'], (oldData) => {
        if (!oldData) return [newData]
        return [newData, ...oldData]
      })
      toast.success('Anggota berhasil ditambahkan!')
      // Background sync
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
    onError: (error) => {
      if (error.code === '23505') {
        toast.error('ID atau email anggota sudah terdaftar.')
      } else {
        toast.error('Gagal menyimpan anggota: ' + error.message)
      }
    }
  })
}

// Update member
export function useUpdateMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data, error } = await supabase
        .from('members')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (updatedData) => {
      // Update cache lokal langsung
      queryClient.setQueryData(['members'], (oldData) => {
        if (!oldData) return [updatedData]
        return oldData.map((member) => 
          member.id === updatedData.id ? updatedData : member
        )
      })
      toast.success('Data anggota diperbarui.')
      // Background sync
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
    onError: (error) => {
      toast.error('Gagal memperbarui: ' + error.message)
    }
  })
}

// Hapus member
export function useDeleteMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase
        .from('members')
        .delete()
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_, deletedId) => {
      // Hapus data dari cache lokal secara instan
      queryClient.setQueryData(['members'], (oldData) => {
        if (!oldData) return []
        return oldData.filter((member) => member.id !== deletedId)
      })
      toast.success('Data anggota berhasil dihapus.')
    },
    onError: (error) => {
      toast.error('Gagal menghapus anggota: ' + error.message)
    }
  })
}
