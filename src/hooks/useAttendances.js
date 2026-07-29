import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

// 1. Fetch by class ID
export function useAttendancesByClass(classId) {
  return useQuery({
    queryKey: ['attendances', classId],
    queryFn: async () => {
      if (!classId) return []
      const { data, error } = await supabase
        .from('attendances')
        .select(`
          id,
          status,
          method,
          notes,
          scanned_at,
          member_id,
          members (
            name,
            divisi,
            nim
          )
        `)
        .eq('class_id', classId)
        .order('scanned_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!classId
  })
}

// 2. Scan absensi baru (Mutasi)
export function useScanAbsen() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ class_id, member_id }) => {
      const { error } = await supabase
        .from('attendances')
        .insert({
          class_id,
          member_id,
          status: 'hadir',
          method: 'barcode'
        })
      
      if (error) {
        if (error.code === '23505') {
          throw new Error('DUPLICATE')
        }
        throw error
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate specific class attendances
      queryClient.invalidateQueries({ queryKey: ['attendances', variables.class_id] })
    }
    // No toast in hook per instruction
  })
}

// 3. Absensi manual (Mutasi)
export function useManualAbsen() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ class_id, member_id, status, notes }) => {
      const { error } = await supabase
        .from('attendances')
        .insert({
          class_id,
          member_id,
          status,
          method: 'manual',
          notes
        })
      
      if (error) {
        if (error.code === '23505') throw new Error('DUPLICATE')
        throw error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendances', variables.class_id] })
    }
  })
}

// 4. Fetch Rekap Absensi (Semua data, digunakan di Rekap.jsx)
export function useRekapAbsensi() {
  return useQuery({
    queryKey: ['rekap_attendances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendances')
        .select(`
          id,
          status,
          method,
          scanned_at,
          member_id,
          class_id,
          members (
            name,
            divisi,
            nim
          ),
          classes (
            name,
            divisi,
            date
          )
        `)
        .order('scanned_at', { ascending: false })

      if (error) throw error
      return data || []
    }
  })
}
