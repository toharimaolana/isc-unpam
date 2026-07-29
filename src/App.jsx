import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/useAuthStore'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Classes from './pages/Classes'
import Scan from './pages/Scan'
import ClassDetail from './pages/ClassDetail'
import Rekap from './pages/Rekap'
import PageWrapper from './components/layout/PageWrapper'

function App() {
  const { user, loading, setUser, setProfile, setLoading } = useAuthStore()

  useEffect(() => {
    let mounted = true

    // 1. Ambil session saat pertama kali load secara manual
    // Ini mencegah bug layar loading terus berputar di React 18 StrictMode
    const initSession = async () => {
      const timeout = setTimeout(() => {
        if (mounted) {
          console.warn('Supabase timeout — paksa keluar loading')
          setLoading(false)
        }
      }, 5000)

      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (session) {
          setUser(session.user)
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()
            
          if (mounted) setProfile(profile)
        }
      } catch (err) {
        console.error('Gagal inisialisasi sesi:', err)
      } finally {
        clearTimeout(timeout)
        if (mounted) setLoading(false)
      }
    }

    initSession()

    // 2. Pantau perubahan auth selanjutnya (Login / Logout / Tab Sync)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Kita abaikan INITIAL_SESSION karena sudah di-handle oleh initSession() di atas
      if (event === 'INITIAL_SESSION') return

      if (session) {
        setUser(session.user)
        // Jangan tampilkan layar loading penuh jika ini hanya sync antar tab (event SIGNED_IN)
        // Ini menghindari form/state aplikasi hilang saat user buka tab baru
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()
            
          if (mounted) setProfile(profile)
        } catch (err) {
          console.error('Gagal sinkronisasi profil antar tab:', err)
        }
      } else {
        setUser(null)
        if (mounted) setProfile(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setUser, setProfile, setLoading])

  // Tambahkan ini SEBELUM return Routes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <span className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        path="/*"
        element={
          user ? (
            <PageWrapper>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="members" element={<Members />} />
                <Route path="classes" element={<Classes />} />
                <Route path="classes/:classId" element={<ClassDetail />} />
                <Route path="scan" element={<Scan />} />
                <Route path="rekap" element={<Rekap />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </PageWrapper>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}

export default App
