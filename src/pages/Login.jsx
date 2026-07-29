import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { Button, Input, Card } from '../components/common'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      toast.success('Login berhasil! Selamat datang.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Login gagal, silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <Card className="relative bg-white/95 backdrop-blur-md border border-slate-200/50 shadow-2xl rounded-2xl p-8 sm:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
              <span className="text-white font-black text-2xl tracking-tighter">AK</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Absen<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Ku</span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 font-medium">
              Sistem Absensi Komunitas ISC UNPAM
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              required
              id="email"
              label="Alamat Email"
              type="email"
              placeholder="admin@isc.com"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <Input
              required
              id="password"
              label="Kata Sandi"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/15 transition-all duration-200"
            >
              Masuk ke Aplikasi
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Login
