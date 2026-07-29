import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('date', { ascending: false })
      if (error) throw error
      return data || []
    }
  })
}

export function useClass(id) {
  return useQuery({
    queryKey: ['classes', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id
  })
}

export function useAddClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newClass) => {
      const { error } = await supabase.from('classes').insert(newClass)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      toast.success('Kelas berhasil dibuat')
    },
    onError: (error) => {
      toast.error(`Gagal membuat kelas: ${error.message}`)
    }
  })
}

export function useDeleteClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('classes').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      toast.success('Kelas berhasil dihapus')
    },
    onError: (error) => {
      toast.error(`Gagal menghapus kelas: ${error.message}`)
    }
  })
}
