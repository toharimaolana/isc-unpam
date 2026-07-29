import { useState } from 'react'
import { Menu, LogOut, User } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { useAuthStore } from '../../store/useAuthStore'
import { Button } from '../common'

export default function PageWrapper({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const logout = useAuthStore((state) => state.logout)
  const profile = useAuthStore((state) => state.profile)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Sidebar Layout */}
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:pl-[260px] min-h-screen transition-all duration-300">
        {/* Top Header bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between bg-white px-6 py-4 border-b border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={handleDrawerToggle}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-slate-500 md:block hidden">
              Portal ISC UNPAM
            </span>
          </div>

          {/* User Details & Logout */}
          <div className="flex items-center gap-4">
            {profile?.name && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Operator: {profile.name}</span>
              </div>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={logout}
              className="!text-red-600 !border-red-200 hover:!bg-red-50 !rounded-xl text-xs font-semibold"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Keluar
            </Button>
          </div>
        </header>

        {/* Content body container */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
