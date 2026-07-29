import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  logout: async () => {
    // 1. Langsung hapus state lokal agar UI seketika bereaksi dan redirect ke halaman Login
    set({ user: null, profile: null })
    
    // 2. Beri tahu Supabase untuk menghapus sesi di background
    try {
      // scope: 'local' akan memaksa penghapusan token di local storage browser
      // bahkan sebelum request ke server selesai, mencegah user login otomatis jika di-refresh
      await supabase.auth.signOut({ scope: 'local' })
    } catch (err) {
      console.error('Logout error:', err)
    }
  }
}))
