import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useRealtimeAbsen(classId) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!classId) return

    const channel = supabase
      .channel(`realtime-absen-${classId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'attendances',
          filter: `class_id=eq.${classId}`
        },
        (payload) => {
          // Invalidate attendances for this class when a new one is inserted
          queryClient.invalidateQueries({ queryKey: ['attendances', classId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [classId, queryClient])
}
